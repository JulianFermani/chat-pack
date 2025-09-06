import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { getFirstNumber } from './services/first-number.service';
import { getSecondNumer } from './services/second-number.service';
import { addTwoNumbers } from './services/add-two-numbers.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class SumarDosNumerosHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    switch (session.step) {
      case 1:
        return await getFirstNumber(message, this.whatsappClient, session);
      case 2:
        return await getSecondNumer(message, this.whatsappClient, session);
      case 3:
        return await addTwoNumbers(message, this.whatsappClient, session);
    }
  }
}
