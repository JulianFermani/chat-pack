import { Message, Client } from 'whatsapp-web.js';
import { UserSession } from '../sessions/userSession.interface';

export interface Command<T = any> {
  name: string;
  description: string;
  execute(
    message: Message,
    client: Client,
    session: UserSession<T>,
  ): Promise<UserSession<T> | void>;
}
