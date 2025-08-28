import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';

export async function getFirstNumber(
  message: Message,
  client: Client,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData>> {
  await client.sendMessage(message.from, 'Por favor, envía el primer número:');
  session.step = 2;
  session.back = false;
  return session;
}
