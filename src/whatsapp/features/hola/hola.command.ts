import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { HolaHandler } from './hola.handler';
import { CommandRegistry } from '@application/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';

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
