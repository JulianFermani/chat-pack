import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { StickerDirectMessageCommand } from './sticker-direct-message.command';
import { StickerDirectMessageHandler } from './sticker-direct-message.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [StickerDirectMessageCommand, StickerDirectMessageHandler],
  exports: [StickerDirectMessageCommand],
})
export class StickerDirectMessageModule {}
