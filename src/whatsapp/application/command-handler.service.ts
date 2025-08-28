import { Injectable, Logger } from '@nestjs/common';
import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import { Command } from '../shared/interfaces/command.interface';
import { UserSession } from '../session/user-session.interface';
import { CommandRegistry } from '../command-registry';
import { SessionManager } from '../session/session-manager';
import { backOneSession } from '../shared/utils/back-one-session.util';

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
    const text = message.body.toLocaleLowerCase();
    const words = ['sticker', 'imagen'];
    const hasSome = words.some((word) => text.includes(word));
    const userId = message.from;

    let session = this.sessionManager.get(userId);

    // Si la sesión existe
    if (session) {
      // Antes chequeo si el mensaje es:
      // 0: Retrocedo un paso la sesión del usuario
      // 99: Mato la sesión del usuario
      session = await backOneSession(
        message,
        client,
        session,
        this.sessionManager,
      );
      // Si elimina la sesión que retorne vacio
      if (!session) return;

      // Busca el comando
      const commandName = session.commandName;
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
        await client.sendSeen(userId);
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
      command = this.commandRegistry.get(commandName);

      if (!command) {
        await client.sendMessage(
          userId,
          `Comando desconocido: ${commandName}, para ver la lista de comandos envie */comandos*`,
        );
        await client.sendSeen(userId);
        return;
      }
    } else if (
      message.type === MessageTypes.IMAGE ||
      message.type === MessageTypes.VIDEO ||
      message.type === MessageTypes.STICKER ||
      (hasSome && message.hasQuotedMsg)
    ) {
      const isGroup = message.from.endsWith('@g.us');
      command = this.commandRegistry.get(
        isGroup ? 'stickergroupmessage' : 'stickerdirectmessage',
      );
    } else {
      await client.sendSeen(userId);
      return;
    }

    try {
      if (!command) return;
      if (command.usesSession) {
        const newSession: UserSession<any> = {
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
      await client.sendMessage(userId, 'Error ejecutando el comando.');
      await client.sendSeen(userId);
    }
  }
}
