import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { CommandRegistry } from '@application/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';

@Injectable()
export class SumarDosNumerosCommand extends AbstractCommand<SumarDosNumerosData> {
  name = 'sumarDosNumeros';
  description = 'Realiza la suma de dos números en dos pasos interactivos.';
  usesSession = true;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SumarDosNumerosHandler,
  ) {
    super(registry);
  }

  async execute(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    return this.handler.handle(message, session);
  }
}
