import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

@Injectable()
export class SecondNumberState implements State<SumarDosNumerosData> {
  readonly stepId = SumarDosNumerosEnumCommands.SECOND_NUMBER;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<void | UserSession<SumarDosNumerosData>> {
    let num1: number;
    if (session.data.num1 && session.back === true) {
      num1 = session.data.num1;
    } else {
      num1 = Number(message.body.trim());
    }
    if (isNaN(num1)) {
      await this.whatsapp.sendMessage(
        message.from,
        'No es un número válido. Intenta de nuevo:',
      );
      return session; // permite repetir el paso 2
    }
    session.data.num1 = num1;
    await this.whatsapp.sendMessage(
      message.from,
      'Ahora envía el segundo número:',
    );
    session.steps.push(SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS);
    session.back = false;
    return session;
  }
}
