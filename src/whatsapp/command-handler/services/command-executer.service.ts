import { Injectable, Logger } from '@nestjs/common';

import { Message } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';
import { MessageContext } from '@command-handler/interfaces/message-context.interface';
import { SessionManager } from '@session/session-manager';
import { UserSession } from '@session/user-session.interface';
import { Command } from '@shared/interfaces/command.interface';

@Injectable()
export class CommandExecuterService {
  private readonly logger = new Logger(CommandExecuterService.name);
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly whatsappClient: WhatsappService,
  ) {}

  async executeCommandFlow(ctx: MessageContext, command: Command) {
    try {
      if (command.usesSession) {
        const newSession: UserSession<any> = {
          commandName: command.name,
          steps: [command.firstStep],
          data: {},
        };
        this.sessionManager.set(ctx.userId, newSession);
        await this.executeCommandAndPersist(command, ctx.message, newSession);
      } else {
        await command.execute(ctx.message);
      }
    } catch (err: unknown) {
      await this.handleExecutionError(err, ctx.userId);
    }
  }

  // Ejecuta el comando y persiste/borra sesión según lo devuelto por command.execute(...)
  async executeCommandAndPersist(
    command: Command,
    message: Message,
    session?: UserSession<any>,
  ): Promise<void> {
    try {
      const updatedSession = await command.execute(message, session);
      if (updatedSession) {
        this.sessionManager.set(message.from, updatedSession);
      } else {
        this.sessionManager.delete(message.from);
      }
    } catch (err: unknown) {
      await this.handleExecutionError(err, message.from);
    }
  }

  private async handleExecutionError(error: unknown, userId: string) {
    if (error instanceof Error) {
      this.logger.error(`Error ejecutando comando: ${error.message}`);
    } else {
      this.logger.error('Error ejecutando comando: unknown error');
    }
    await this.whatsappClient.sendMessage(
      userId,
      'Error ejecutando el comando.',
    );
    await this.whatsappClient.sendSeen(userId);
  }
}
