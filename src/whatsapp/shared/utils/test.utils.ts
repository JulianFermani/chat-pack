import { UserSession } from 'src/whatsapp/session/user-session.interface';

export function backOneSession<T>(session: UserSession<T>): UserSession<T> {
  session.step -= 2;
  session.back = true;
  return session;
}
