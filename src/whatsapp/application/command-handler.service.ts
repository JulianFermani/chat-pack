import { Injectable, Logger } from '@nestjs/common';
import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import { Command } from '../domain/commands/interfaces/command.interface';
import { UserSession } from '../session/user-session.interface';
import { CommandRegistry } from '../command-registry';
import { SessionManager } from '../session/session-manager';

@Injectable()
export class CommandHandlerService {
  private readonly logger = new Logger(CommandHandlerService.name);
  constructor(
    private readonly commandRegistry: CommandRegistry,
    private readonly sessionManager: SessionManager,
  ) {}

  async handle(message: Message, client: Client) {
    let command: Command | undefined;
    const body = message.body.trim();
    const isGroup = message.from.endsWith('@g.us');
    const text = message.body.toLocaleLowerCase();
    const words = ['sticker', 'imagen'];
    const hasSome = words.some((word) => text.includes(word));
    const userId = message.from;

    const session = this.sessionManager.get(userId);
    this.logger.log(`Session commandName: ${session?.commandName}`);
    this.logger.log(`Session step: ${session?.step}`);

    // Si la sesión existe
    if (session) {
      // Busca el comando
      const commandName = this.sessionManager.get(
        session.commandName,
      )?.commandName;
      if (!commandName) {
        this.logger.log('Vaya vaya..');
        return;
      }
      command = this.commandRegistry.get(commandName);
      // Si no existe el comando
      // Elimina el usuario de la sesión y envia un mensaje
      if (!command) {
        this.sessionManager.delete(userId);
        await client.sendMessage(
          userId,
          'Error: comando no encontrado, para ver la lista de comandos envie */comandos*',
        );
        await client.sendSeen(message.from);
        return;
      }

      // Ejecuta el comando y recibe la sesión updateada del usuario
      const updatedSession = await command.execute(message, client, session);
      if (updatedSession) {
        this.sessionManager.set(userId, updatedSession);
      } else {
        this.sessionManager.delete(userId);
      }
      return;
    }

    // No existe una sesión activa, arranca una nueva
    if (body.startsWith('/')) {
      const [commandName] = body.slice(1).split(' ');
      this.logger.log(`commandName: ${commandName}`);
      command = this.commandRegistry.get(commandName);
      if (!command) {
        await client.sendMessage(
          message.from,
          `Comando desconocido: ${commandName}, para ver la lista de comandos envie */comandos*`,
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
      command = this.commandRegistry.get(
        isGroup ? 'stickergroupmessage' : 'stickerdirectmessage',
      );
    } else {
      await client.sendSeen(message.from);
      return;
    }

    try {
      if (!command) return;

      if (command.usesSession) {
        const newSession: UserSession = {
          commandName: command.name,
          step: 1,
          data: {},
        };
        this.sessionManager.set(userId, newSession);

        const updatedSession = await command.execute(
          message,
          client,
          newSession,
        );
        if (updatedSession) {
          this.sessionManager.set(userId, updatedSession);
        } else {
          this.sessionManager.delete(userId);
        }
      } else {
        await command.execute(message, client);
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
