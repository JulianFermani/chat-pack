import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';

export async function addTwoNumbers(
  message: Message,
  client: Client,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData> | void> {
  const num2 = Number(message.body.trim());
  if (isNaN(num2)) {
    await client.sendMessage(
      message.from,
      'No es un número válido. Intenta de nuevo:',
    );
    return session; // repetir paso 3
  }
  session.data.num2 = num2;
  let suma = 0;
  if (session.data.num1 != undefined) {
    suma = session.data.num1 + session.data.num2;
  }
  await client.sendMessage(
    message.from,
    `El resultado de la suma es: ${suma}\n\n0. Para volver al paso anterior`,
  );
  session.step = 4;
  console.log(`Session num1 en el tercer paso: ${session.data.num1}`);
  console.log(`Session num2 en el tercer paso: ${session.data.num2}`);
  return session;
}
