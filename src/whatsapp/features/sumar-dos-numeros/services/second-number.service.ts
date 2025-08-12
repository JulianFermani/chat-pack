import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';

export async function getSecondNumer(
  message: Message,
  client: Client,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData>> {
  let num1: number;
  console.log(`message.body: ${message.body}`);
  console.log(`Session back en el segundo paso: ${session.back}`);
  if (session.data.num1 && session.back === true) {
    console.log(`ENTRO ALGUNA VEZ ACÁ`);
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
  console.log(`Session num1 en el segundo paso: ${session.data.num1}`);
  console.log(`Session num2 en el segundo paso: ${session.data.num2}`);
  return session;
}
