import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { Message } from 'whatsapp-web.js';

export async function holaSender(
  message: Message,
  whatsappClient: WhatsappService,
): Promise<void> {
  await whatsappClient.sendMessage(message.from, '¡Hola! Soy tu bot.');
}
