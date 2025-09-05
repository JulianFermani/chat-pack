import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function addTwoNumbers(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData> | void> {
  const num2 = Number(message.body.trim());
  if (isNaN(num2)) {
    await whatsappClient.sendMessage(
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
  await whatsappClient.sendMessage(
    message.from,
    `El resultado de la suma es: ${suma}\n\n━━━━━━━━━━━━\n0️⃣ Volver atrás\n9️⃣9️⃣ Terminar sesión\n━━━━━━━━━━━━`,
  );
  session.step = 4;
  return session;
}
