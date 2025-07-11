import { Message, Client } from 'whatsapp-web.js';
import { Command } from './command.interface';
import { UserSession } from './usersession.interface';

export class StickerGroupMessage implements Command {
  name = 'stickerGroupMessage';
  description =
    'Convierte una foto o un video a sticker y viceversa de un grupo';

  async execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null> {
    if (
      message.body.toLocaleLowerCase().includes('sticker') &&
      message.hasMedia
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
          `Imagen --> Sticker a ${message.author}: ${(await message.getContact()).pushname} en grupo ${(await message.getChat()).name}`,
        );
      } catch (error) {
        console.error(
          `Error convirtiendole sticker --> imagen a ${message.author} en grupo ${(await message.getChat()).name}: ${error}`,
        );
        void client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
      }
    } else if (
      message.body.toLocaleLowerCase().includes('sticker') &&
      message.hasQuotedMsg
    ) {
      const quotedMsg = await message.getQuotedMessage();
      if (quotedMsg.hasMedia) {
        void client.sendMessage(message.from, '*[⏳]* Cargando..');
        try {
          const media = await quotedMsg.downloadMedia();
          await client.sendMessage(message.from, media, {
            sendMediaAsSticker: true,
            stickerName: '...',
            stickerAuthor: '...',
          });
          console.log(
            `Imagen --> Sticker a ${message.author}: ${(await message.getContact()).pushname} en grupo ${(await message.getChat()).name}`,
          );
          void client.sendMessage(message.from, '*[✅]* Servite pa');
        } catch (error) {
          console.error(
            `Error convirtiendole sticker --> imagen a ${message.author} en grupo ${(await message.getChat()).name}: ${error}`,
          );
          void client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
        }
      } else {
        void message.reply('*[❎]* Responde una imagen primero');
      }
    } else if (
      message.body.toLocaleLowerCase().includes('imagen') &&
      message.hasQuotedMsg
    ) {
      const quotedMsg = await message.getQuotedMessage();
      if (quotedMsg.hasMedia) {
        void client.sendMessage(message.from, '*[⏳]* Cargando..');
        try {
          const media = await quotedMsg.downloadMedia();
          await client.sendMessage(message.from, media, {
            caption: quotedMsg.body,
          });
          void client.sendMessage(message.from, '*[✅]* Servite pa');
          console.log(
            `Sticker --> Imagen a ${message.author}: ${(await message.getContact()).pushname} en grupo ${(await message.getChat()).name}`,
          );
        } catch (error) {
          console.error(
            `Error convirtiendole imagen --> sticker a ${message.author} en grupo ${(await message.getChat()).name}: ${error}`,
          );
          void client.sendMessage(message.from, '*[❎]* Uuuu algo falló');
        }
      } else {
        void message.reply('*[❎]* Responde un sticker primero');
      }
    }
    return null;
  }
}
