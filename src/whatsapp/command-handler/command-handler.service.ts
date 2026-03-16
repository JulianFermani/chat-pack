import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Message, MessageTypes } from 'whatsapp-web.js';

import { MessageContext } from './interfaces/message-context.interface';
import {
  SessionFlowService,
  CommandResolverService,
  CommandExecuterService,
} from './services';
import { WhatsappService } from '@client/whatsapp.service';
import { SessionManager } from '@session/session-manager';

@Injectable()
export class CommandHandlerService {
  private readonly logger = new Logger(CommandHandlerService.name);
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly whatsappClient: WhatsappService,
    private readonly sessionFlowService: SessionFlowService,
    private readonly commandResolver: CommandResolverService,
    private readonly commandExecuterService: CommandExecuterService,
  ) {}

  private buildContext(message: Message): MessageContext {
    const body = message.body.trim();
    const text = body.toLowerCase();

    const isCommand = body.startsWith('/');

    const commandName = isCommand ? body.slice(1).split(' ')[0] : undefined;

    const isGroup = message.from.endsWith('@g.us');

    const isMedia =
      message.type === MessageTypes.IMAGE ||
      message.type === MessageTypes.VIDEO ||
      message.type === MessageTypes.STICKER;

    return {
      userId: message.from,
      body,
      normalizedText: text,
      isCommand,
      commandName,
      isGroup,
      isMedia,
      message,
    };
  }

  @OnEvent('whatsapp.message')
  async handle(message: Message) {
    const ctx = this.buildContext(message);

    const session = this.sessionManager.get(ctx.userId);

    // Si la sesión existe
    if (session) {
      await this.sessionFlowService.handleExistingSession(ctx, session);
      return;
    }

    const command = await this.commandResolver.resolve(ctx);
    if (!command) {
      await this.whatsappClient.sendSeen(ctx.userId);
      return;
    }

    // 3) Ejecutar comando (sesión o no)
    await this.commandExecuterService.executeCommandFlow(ctx, command);
  }
}
