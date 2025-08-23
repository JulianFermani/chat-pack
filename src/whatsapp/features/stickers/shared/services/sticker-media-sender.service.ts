import { Client, Message } from 'whatsapp-web.js';
import * as config from '../config/config.json';
import { MessageSendOptions } from 'whatsapp-web.js';

export async function stickerMediaSender(
  message: Message,
  client: Client,
  isImage: boolean,
): Promise<void> {
  const options: MessageSendOptions = config;
  await client.sendMessage(message.from, '*[⏳]* Cargando..');
  try {
    const media = await message.downloadMedia();
    if (isImage) {
      await client.sendMessage(message.from, media, options);
      console.log(
        `Imagen --> Sticker a ${message.from}: ${(await message.getContact()).pushname}`,
      );
    } else {
      await client.sendMessage(message.from, media);
      console.log(
        `Sticker --> Imagen a ${message.from}: ${(await message.getContact()).pushname}`,
      );
    }
    await client.sendMessage(message.from, '*[✅]* Servite pa');
  } catch (error) {
    console.error(`Error convirtiendole ${message.from}: ${error}`);
    await client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
  }
}
