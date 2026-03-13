import { forwardRef, Module } from '@nestjs/common';

import { StickerDirectMessageCommand } from './sticker-direct-message.command';
import { StickerDirectMessageHandler } from './sticker-direct-message.handler';
import { WhatsappModule } from '@application/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [StickerDirectMessageCommand, StickerDirectMessageHandler],
  exports: [StickerDirectMessageCommand],
})
export class StickerDirectMessageModule {}
