import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

@Injectable()
export class FirstNumberState implements State<SumarDosNumerosData> {
  readonly stepId = SumarDosNumerosEnumCommands.FIRST_NUMBER;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<void | UserSession<SumarDosNumerosData>> {
    await this.whatsapp.sendMessage(
      message.from,
      'Por favor, envía el primer número:',
    );
    session.steps.push(SumarDosNumerosEnumCommands.SECOND_NUMBER);
    session.back = false;
    return session;
  }
}
