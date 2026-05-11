import { Injectable, Logger } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { MessageContext } from '@command-handler/interfaces/message-context.interface';
import { CommandRegistry } from '@command-registry/command-registry';
import { SessionManager } from '@session/session-manager';
import { UserSession } from '@session/user-session.interface';
import { backOneSession } from '@shared/utils/back-one-session.util';
import { CommandExecuterService } from './command-executer.service';

@Injectable()
export class SessionFlowService {
  constructor(
    private readonly commandRegistry: CommandRegistry,
    private readonly whatsappClient: WhatsappService,
    private readonly sessionManager: SessionManager,
    private readonly commandExecuterService: CommandExecuterService,
  ) {}

  private readonly logger = new Logger(SessionFlowService.name);

  async handleExistingSession(ctx: MessageContext, session: UserSession) {
    // Antes chequeo si el mensaje es:
    // 0: Retrocedo un paso la sesión del usuario
    // 99: Mato la sesión del usuario
    const updated = await backOneSession(
      ctx.message,
      this.whatsappClient,
      session,
      this.sessionManager,
    );
    // Si elimina la sesión que retorne vacio
    if (!updated) return;

    // Busca el comando
    const commandName = session.commandName;
    if (!commandName) {
      this.logger.warn(`Sesión sin commandName para ${ctx.userId}`);
      return;
    }
    const command = this.commandRegistry.get(commandName);
    // Si no existe el comando
    // Elimina el usuario de la sesión y envia un mensaje
    if (!command) {
      this.sessionManager.delete(ctx.userId);
      await this.whatsappClient.sendMessage(
        ctx.userId,
        'Error: comando no encontrado, para ver la lista de comandos envie */comandos*',
      );
      return;
    }

    // Ejecuta el comando y recibe la sesión updateada del usuario
    const updatedSession = await command.execute(ctx.message, session);
    if (updatedSession) {
      this.sessionManager.set(ctx.userId, updatedSession);
    } else {
      this.sessionManager.delete(ctx.userId);
    }
  }
}
