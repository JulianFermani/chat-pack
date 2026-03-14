import { Message } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';

export async function holaSender(
  message: Message,
  whatsappClient: WhatsappService,
): Promise<void> {
  await whatsappClient.sendMessage(message.from, '¡Hola! Soy tu bot.');
}
