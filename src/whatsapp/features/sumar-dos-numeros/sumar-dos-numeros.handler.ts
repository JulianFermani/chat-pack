import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { getFirstNumber } from './services/first-number.service';
import { getSecondNumer } from './services/second-number.service';
import { addTwoNumbers } from './services/add-two-numbers.service';
import { backOneSession } from 'src/whatsapp/shared/utils/test.utils';
import { SessionManager } from 'src/whatsapp/session/session-manager';

export class SumarDosNumerosHandler {
  static async handle(
    message: Message,
    client: Client,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    console.log(`SESIÓN STEP ANTES: ${session.step}`);
    console.log(`Message body: ${message.body.trim()}`);
    console.log(`message.body.trim() === '0': ${message.body.trim() === '0'}`);
    const sessionManager = new SessionManager();
    if (message.body.trim() === '0') {
      session = backOneSession(session);
    } else if (message.body.trim() === '-1') {
      sessionManager.delete(message.from);
      console.log(`Mato la sesión`);
    }
    console.log(`SESIÓN STEP: ${session.step}`);
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
