import { Message, Client } from 'whatsapp-web.js';

export interface Command {
  name: string;
  description: string;
  execute(message: Message, client: Client): Promise<void>;
}
