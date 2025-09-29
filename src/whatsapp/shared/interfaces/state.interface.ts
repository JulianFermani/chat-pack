import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';

export interface State<T = any> {
  handle(
    message: Message,
    session: UserSession<T>,
  ): Promise<UserSession<T> | void>;
  stepId: number;
}
