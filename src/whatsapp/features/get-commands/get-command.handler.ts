import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { getCommandSender } from './services/get-command-sender.service';
import { CommandRegistry } from '@application/command-registry';
import { WhatsappService } from '@application/whatsapp.service';

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
