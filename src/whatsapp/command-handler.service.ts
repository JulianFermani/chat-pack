import { Injectable, Logger } from '@nestjs/common';
import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import * as Commands from './commands';
import { Command } from './commands/command.interface';
import { UserSession } from './commands/usersession.interface';

@Injectable()
export class CommandHandlerService {
  private readonly logger = new Logger(CommandHandlerService.name);
  private commands: Map<string, Command> = new Map();
  private sessions: Map<string, UserSession> = new Map();

  constructor() {
    Object.values(Commands).forEach((CommandClass) => {
      const commandInstance = new CommandClass();
      this.registerCommand(commandInstance);
    });
  }

  registerCommand(command: Command) {
    this.commands.set(command.name.toLowerCase(), command);
    this.logger.log(`Comando registrado: ${command.name}`);
  }

  async handle(message: Message, client: Client) {
    let command: Command | undefined;
    const body = message.body.trim();
    const isGroup = message.from.endsWith('@g.us');
    const text = message.body.toLocaleLowerCase();
    const words = ['sticker', 'imagen'];
    const hasSome = words.some((word) => text.includes(word));
    const userId = message.from;
    const session = this.sessions.get(userId);
    this.logger.log(`Session commandName: ${session?.commandName}`);
    this.logger.log(`Session step: ${session?.step}`);

    // Si la sesión existe
    if (session) {
      // Busca el comando
      command = this.commands.get(session.commandName.toLowerCase());
      // Si no existe el comando
      // Elimina el usuario de la sesión y envia un mensaje
      if (!command) {
        this.sessions.delete(userId);
        await client.sendMessage(userId, 'Error: comando no encontrado');
        await client.sendSeen(message.from);
        return;
      }

      // Ejecuta el comando y recibe la sesión updateada del usuario
      const updatedSession = await command.execute(message, client, session);
      if (updatedSession) {
        this.sessions.set(userId, updatedSession);
      } else {
        this.sessions.delete(userId);
      }
      return;
    }

    // No existe una sesión activa, arranca una nueva
    if (body.startsWith('/')) {
      const [commandName] = body.slice(1).split(' ');
      this.logger.log(`commandName: ${commandName}`);
      command = this.commands.get(commandName.toLowerCase());
      if (!command) {
        await client.sendMessage(
          message.from,
          `Comando desconocido: ${commandName}`,
        );
        await client.sendSeen(message.from);
        return;
      }
    } else if (
      message.type === MessageTypes.IMAGE ||
      message.type === MessageTypes.VIDEO ||
      message.type === MessageTypes.STICKER ||
      (hasSome && message.hasQuotedMsg)
    ) {
      if (!isGroup) {
        command = this.commands.get('stickerdirectmessage');
      } else {
        command = this.commands.get('stickergroupmessage');
      }
    } else {
      await client.sendSeen(message.from);
    }

    const newSession: UserSession = {
      commandName: command?.name ?? '',
      step: 1,
      data: {},
    };

    try {
      if (command !== undefined) {
        this.sessions.set(userId, newSession);
        const updatedSession = await command.execute(
          message,
          client,
          newSession,
        );
        if (updatedSession) {
          this.sessions.set(userId, updatedSession);
        } else {
          this.sessions.delete(userId);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error ejecutando comando: ${error.message}`);
      }
      await client.sendMessage(message.from, 'Error ejecutando el comando.');
      await client.sendSeen(message.from);
    }
  }
}
