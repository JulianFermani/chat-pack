import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { StickerGroupMessageCommand } from './sticker-group-message.command';
import { StickerGroupMessageHandler } from './sticker-group-message.handler';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  providers: [StickerGroupMessageCommand, StickerGroupMessageHandler],
  exports: [StickerGroupMessageCommand],
})
export class StickerGroupMessageModule {}
