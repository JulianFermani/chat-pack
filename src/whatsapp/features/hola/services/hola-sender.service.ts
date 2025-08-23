import { Message, Client } from 'whatsapp-web.js';

export async function holaSender(
  message: Message,
  client: Client,
): Promise<void> {
  await client.sendMessage(message.from, '¡Hola! Soy tu bot.');
}
