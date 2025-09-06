import { Message } from 'whatsapp-web.js';
import * as config from '../config/config.json';
import { MessageSendOptions } from 'whatsapp-web.js';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function stickerMediaSender(
  message: Message,
  whatsappClient: WhatsappService,
  isImage: boolean,
): Promise<void> {
  const options: MessageSendOptions = config;
  await whatsappClient.sendMessage(message.from, '*[⏳]* Cargando..');
  try {
    const media = await message.downloadMedia();
    if (isImage) {
      await whatsappClient.sendMediaToSticker(message.from, media, options);
      console.log(
        `Imagen --> Sticker a ${message.from}: ${(await message.getContact()).pushname}`,
      );
    } else {
      await whatsappClient.sendPhotoWithCaption(message.from, media);
      console.log(
        `Sticker --> Imagen a ${message.from}: ${(await message.getContact()).pushname}`,
      );
    }
    await whatsappClient.sendMessage(message.from, '*[✅]* Servite pa');
  } catch (error) {
    console.error(`Error convirtiendole ${message.from}: ${error}`);
    await whatsappClient.sendMessage(message.from, '*[❎]* Uuuu algo falló');
  }
}
