import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { SumarDosNumerosSession } from './session/user-session.types';

export class SumarNumerosCommand implements Command {
  name = 'sumarNumeros';
  description = 'Suma dos números en dos pasos';

  async execute(
    message: Message,
    client: Client,
    session: SumarDosNumerosSession,
  ): Promise<SumarDosNumerosSession | null> {
    const userId = message.from;
    const text = message.body.trim();

    switch (session.step) {
      case 1:
        // Pedir primer número
        await client.sendMessage(userId, 'Por favor, envía el primer número:');
        session.step += 1;
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
        session.data.a = num1;
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
        session.data.b = num2;
        const suma = session.data.a + session.data.b;
        await client.sendMessage(userId, `El resultado de la suma es: ${suma}`);
        return null; // comando finalizado
      }
      default:
        return session;
    }
  }
}
