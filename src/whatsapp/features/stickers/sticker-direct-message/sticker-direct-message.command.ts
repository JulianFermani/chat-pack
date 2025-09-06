import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { StickerDirectMessageHandler } from './sticker-direct-message.handler';
import { Injectable } from '@nestjs/common';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';

@Injectable()
export class StickerDirectMessageCommand extends AbstractCommand {
  name = 'stickerDirectMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, en mensajes privados.\nNo es necesario usar el comando: simplemente mandale una imagen o video y te lo convierte a sticker.\nPara convertir un sticker a imagen, enviás el sticker y te devuelve la imagen original.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: StickerDirectMessageHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
