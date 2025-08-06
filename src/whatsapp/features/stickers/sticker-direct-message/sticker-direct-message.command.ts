import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { StickerDirectMessageHandler } from './sticker-direct-message.handler';

export class StickerDirectMessageCommand implements Command {
  name = 'stickerDirectMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, en mensajes privados.\nNo es necesario usar el comando: simplemente mandale una imagen o video y te lo convierte a sticker.\nPara convertir un sticker a imagen, enviás el sticker y te devuelve la imagen original.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await StickerDirectMessageHandler.handle(message, client);
  }
}
