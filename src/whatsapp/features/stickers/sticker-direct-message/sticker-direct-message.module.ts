import { Module } from '@nestjs/common';

import { StickerDirectMessageCommand } from './sticker-direct-message.command';
import { StickerDirectMessageHandler } from './sticker-direct-message.handler';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [StickerDirectMessageCommand, StickerDirectMessageHandler],
  exports: [StickerDirectMessageCommand],
})
export class StickerDirectMessageModule {}
