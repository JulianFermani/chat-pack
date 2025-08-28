import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { getFirstNumber } from './services/first-number.service';
import { getSecondNumer } from './services/second-number.service';
import { addTwoNumbers } from './services/add-two-numbers.service';

export class SumarDosNumerosHandler {
  static async handle(
    message: Message,
    client: Client,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    switch (session.step) {
      case 1:
        return await getFirstNumber(message, client, session);
      case 2:
        return await getSecondNumer(message, client, session);
      case 3:
        return await addTwoNumbers(message, client, session);
    }
  }
}
