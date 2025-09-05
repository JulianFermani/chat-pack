import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { HolaHandler } from './hola.handler';
import { Injectable } from '@nestjs/common';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';

@Injectable()
export class HolaCommand extends AbstractCommand {
  name = 'hola';
  description = 'Responde con un saludo.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: HolaHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
