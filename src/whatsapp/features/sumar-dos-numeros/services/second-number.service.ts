import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';

export async function getSecondNumer(
  message: Message,
  client: Client,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData>> {
  let num1: number;
  if (session.data.num1 && session.back === true) {
    num1 = session.data.num1;
  } else {
    num1 = Number(message.body.trim());
  }
  if (isNaN(num1)) {
    await client.sendMessage(
      message.from,
      'No es un número válido. Intenta de nuevo:',
    );
    return session; // permite repetir el paso 2
  }
  session.data.num1 = num1;
  await client.sendMessage(message.from, 'Ahora envía el segundo número:');
  session.step = 3;
  session.back = false;
  return session;
}
