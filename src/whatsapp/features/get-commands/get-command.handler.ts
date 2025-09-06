import { Message } from 'whatsapp-web.js';
import { getCommandSender } from './services/get-command-sender.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';

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
