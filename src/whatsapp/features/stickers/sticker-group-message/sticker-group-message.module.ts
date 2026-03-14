import { Module } from '@nestjs/common';

import { WhatsappModule } from '@client/whatsapp.module';
import { StickerGroupMessageCommand } from './sticker-group-message.command';
import { StickerGroupMessageHandler } from './sticker-group-message.handler';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, CommandRegistryModule],
  providers: [StickerGroupMessageCommand, StickerGroupMessageHandler],
  exports: [StickerGroupMessageCommand],
})
export class StickerGroupMessageModule {}
