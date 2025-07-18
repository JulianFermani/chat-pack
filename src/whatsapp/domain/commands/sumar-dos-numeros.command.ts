import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from '../../sessions/user-session.interface';
import { SumarSessionData } from './interfaces/sumarSessionData.interface';

export class SumarNumerosCommand implements Command<SumarSessionData> {
  name = 'sumarNumeros';
  description = 'Suma dos números en dos pasos';
  usesSession: true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SumarSessionData>,
  ): Promise<UserSession<SumarSessionData> | void> {
    const userId = message.from;
    const text = message.body.trim();

    switch (session.step) {
      case 1:
        // Pedir primer número
        await client.sendMessage(userId, 'Por favor, envía el primer número:');
        session.step = 2;
        return session;

      case 2: {
        // Guardar primer número y pedir segundo
        const num1 = Number(text);
        if (isNaN(num1)) {
          await client.sendMessage(
            userId,
            'No es un número válido. Intenta de nuevo:',
          );
          return session; // repetir paso 2
        }
        session.data.num1 = num1;
        await client.sendMessage(userId, 'Ahora envía el segundo número:');
        session.step = 3;
        return session;
      }
      case 3: {
        // Guardar segundo número y mostrar resultado
        const num2 = Number(text);
        if (isNaN(num2)) {
          await client.sendMessage(
            userId,
            'No es un número válido. Intenta de nuevo:',
          );
          return session; // repetir paso 3
        }
        session.data.num2 = num2;
        let suma = 0;
        if (session.data.num1 != undefined) {
          suma = session.data.num1 + session.data.num2;
        }
        await client.sendMessage(userId, `El resultado de la suma es: ${suma}`);
        return;
      }
      default:
        return session;
    }
  }
}
