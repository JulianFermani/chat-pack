import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecondNumberState implements State<SumarDosNumerosData> {
  readonly stepId = 2;
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
    session.step = 3;
    session.back = false;
    return session;
  }
}
