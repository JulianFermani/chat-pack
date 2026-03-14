import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { StickerDirectMessageHandler } from './sticker-direct-message.handler';
import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';

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
