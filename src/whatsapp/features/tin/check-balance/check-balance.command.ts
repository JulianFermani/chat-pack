import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';
import { CheckBalanceHandler } from './check-balance.handler';

@Injectable()
export class CheckBalanceCommand extends AbstractCommand {
  name = 'consultarSaldo';
  description = 'Consulta el saldo actual de tu tarjeta TIN registrada.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: CheckBalanceHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    await this.handler.handle(message);
  }
}
