import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { RegisterTinHandler } from './register-tin.handler';

@Injectable()
export class RegisterTinCommand extends AbstractCommand {
  name = 'registrarTin';
  description =
    'Registra tu numero de tarjeta TIN para consultar el saldo despues.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: RegisterTinHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
