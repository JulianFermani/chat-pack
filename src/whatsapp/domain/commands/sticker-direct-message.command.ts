import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';

export class StickerDirectMessageCommand implements Command {
  name = 'stickerDirectMessage';
  description = 'Convierte una foto o un video a sticker y viceversa';
  usesSession: false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    if (
      message.type == MessageTypes.IMAGE ||
      message.type == MessageTypes.VIDEO
    ) {
      void client.sendMessage(message.from, '*[⏳]* Cargando..');
      try {
        const media = await message.downloadMedia();
        await client.sendMessage(message.from, media, {
          sendMediaAsSticker: true,
          stickerName: '...',
          stickerAuthor: '...',
        });
        void client.sendMessage(message.from, '*[✅]* Servite pa');
        console.log(
          `Imagen --> Sticker a ${message.from}: ${(await message.getContact()).pushname}`,
        );
      } catch (error) {
        console.error(
          `Error convirtiendole imagen --> sticker a ${message.from}: ${error}`,
        );
        void client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
      }
    } else if (message.type == MessageTypes.STICKER) {
      void client.sendMessage(message.from, '*[⏳]* Cargando..');
      try {
        const media = await message.downloadMedia();
        await client.sendMessage(message.from, media);
        void client.sendMessage(message.from, '*[✅]* Servite pa');
        console.log(
          `Sticker --> Imagen a ${message.from}: ${(await message.getContact()).pushname}`,
        );
      } catch (error) {
        console.error(
          `Error convirtiendole sticker --> imagen a ${message.from}: ${error}`,
        );
        void client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
      }
    }
    return;
  }
}
