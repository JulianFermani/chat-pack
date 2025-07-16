import { Message, Client } from 'whatsapp-web.js';
import { UserSession } from './usersession.interface';

export interface Command {
  name: string;
  description: string;
  execute(
    message: Message,
    client: Client,
    session: UserSession,
  ): Promise<UserSession | null>;
}
