import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { StickerGroupMessageHandler } from './sticker-group-message.handler';

export class StickerGroupMessageCommand implements Command {
  name = 'stickerGroupMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, dentro de un grupo.\n Para usarlo no hace falta el comando: simplemente enviá una imagen o video con la palabra "sticker", o respondé uno con esa palabra para convertirlo.\nPara convertir un sticker en imagen, respondé con la palabra "imagen".';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await StickerGroupMessageHandler.handle(message, client);
  }
}
