import { Message } from 'whatsapp-web.js';

import { UserSession } from '@session/user-session.interface';
export interface Command<T = any> {
  name: string;
  description: string;
  usesSession: boolean;
  firstStep: string;
  execute(
    message: Message,
    session?: UserSession<T>,
  ): Promise<UserSession<T> | void>;
}
