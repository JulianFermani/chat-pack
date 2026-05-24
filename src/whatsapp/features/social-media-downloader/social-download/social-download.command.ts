import { Injectable } from '@nestjs/common';
import { Message } from 'whatsapp-web.js';

import { CommandRegistry } from '@command-registry/command-registry';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { SocialDownloadHandler } from './social-download.handler';

@Injectable()
export class SocialDownloadCommand extends AbstractCommand {
  name = 'socialDownload';
  description =
    'Descarga automaticamente contenido publico de Instagram, TikTok y X/Twitter.';
  usesSession = false;
  firstStep = '';

  constructor(
    registry: CommandRegistry,
    private readonly handler: SocialDownloadHandler,
  ) {
    super(registry);
  }

  async execute(message: Message) {
    await this.handler.handle(message);
  }
}
