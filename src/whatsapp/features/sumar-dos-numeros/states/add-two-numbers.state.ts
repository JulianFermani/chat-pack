import { State } from 'src/whatsapp/shared/interfaces/state.interface';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddTwoNumbersState implements State<SumarDosNumerosData> {
  readonly stepId = 3;
  constructor(private readonly whatsapp: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<void | UserSession<SumarDosNumerosData>> {
    const num2 = Number(message.body.trim());
    if (isNaN(num2)) {
      await this.whatsapp.sendMessage(
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
    await this.whatsapp.sendMessage(
      message.from,
      `El resultado de la suma es: ${suma}\n\n━━━━━━━━━━━━\n0️⃣ Volver atrás\n9️⃣9️⃣ Terminar sesión\n━━━━━━━━━━━━`,
    );
    session.step = 4;
    return session;
  }
}
