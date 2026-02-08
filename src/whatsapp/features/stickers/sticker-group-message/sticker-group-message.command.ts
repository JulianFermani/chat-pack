import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { StickerGroupMessageHandler } from './sticker-group-message.handler';
import { Injectable } from '@nestjs/common';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';

@Injectable()
export class StickerGroupMessageCommand extends AbstractCommand {
  name = 'stickerGroupMessage';
  description =
    'Convierte una foto o video a sticker, y viceversa, dentro de un grupo.\n Para usarlo no hace falta el comando: simplemente enviá una imagen o video con la palabra "sticker", o respondé uno con esa palabra para convertirlo.\nPara convertir un sticker en imagen, respondé con la palabra "imagen".';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: StickerGroupMessageHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
