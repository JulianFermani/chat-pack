import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstNumberState implements State<SumarDosNumerosData> {
  readonly stepId = 1;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<void | UserSession<SumarDosNumerosData>> {
    await this.whatsapp.sendMessage(
      message.from,
      'Por favor, envía el primer número:',
    );
    session.step = 2;
    session.back = false;
    return session;
  }
}
