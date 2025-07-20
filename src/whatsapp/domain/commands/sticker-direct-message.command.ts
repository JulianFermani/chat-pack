import { Message, Client, MessageTypes } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { mediaSender } from './services/media-sender.service';

export class StickerDirectMessageCommand implements Command {
  name = 'stickerDirectMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, en mensajes privados.\nNo es necesario usar el comando: simplemente mandale una imagen o video y te lo convierte a sticker.\nPara convertir un sticker a imagen, enviás el sticker y te devuelve la imagen original.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    if (
      message.type == MessageTypes.IMAGE ||
      message.type == MessageTypes.VIDEO
    ) {
      await mediaSender(message, client, true);
    } else if (message.type == MessageTypes.STICKER) {
      await mediaSender(message, client, false);
    }
    return;
  }
}
