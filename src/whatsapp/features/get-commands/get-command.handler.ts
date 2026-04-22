import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { getCommandSender } from './services/get-command-sender.service';
import { WhatsappService } from '@client/whatsapp.service';
import { CommandRegistry } from '@command-registry/command-registry';

@Injectable()
export class GetCommandHandler {
  constructor(
    private readonly registry: CommandRegistry,
    private readonly whatsappClient: WhatsappService,
  ) {}

  async handle(message: Message): Promise<void> {
    switch (true) {
      case true:
        return getCommandSender(message, this.whatsappClient, this.registry);
    }
  }
}
