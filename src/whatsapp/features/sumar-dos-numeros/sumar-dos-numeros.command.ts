import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Injectable } from '@nestjs/common';

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
