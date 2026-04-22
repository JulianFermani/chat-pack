import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

@Injectable()
export class AddTwoNumbersState implements State<SumarDosNumerosData> {
  readonly stepId = SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS;
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
    session.steps.push(SumarDosNumerosEnumCommands.LAST_STEP);
    return session;
  }
}
