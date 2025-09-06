import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SumarDosNumerosData } from '../sumar-dos-numeros.session';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

export async function getFirstNumber(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<SumarDosNumerosData>,
): Promise<UserSession<SumarDosNumerosData>> {
  await whatsappClient.sendMessage(
    message.from,
    'Por favor, envía el primer número:',
  );
  session.step = 2;
  session.back = false;
  return session;
}
