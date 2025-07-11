import { Message, Client } from 'whatsapp-web.js';
import { UserSession } from './usersession.interface';
import { Command } from './command.interface';

export class SumarNumerosCommand implements Command {
  name = 'sumarNumeros';
  description = 'Suma dos números en dos pasos';

  async execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null> {
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
        const suma = session.data.num1 + session.data.num2;
        await client.sendMessage(userId, `El resultado de la suma es: ${suma}`);
        return null; // comando finalizado
      }
      default:
        return session;
    }
  }
}
