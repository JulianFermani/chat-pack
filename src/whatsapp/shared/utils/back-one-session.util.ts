import { SessionManager } from 'src/whatsapp/session/session-manager';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message, Client } from 'whatsapp-web.js';

export async function backOneSession<T>(
  message: Message,
  client: Client,
  session: UserSession<T>,
  sessionManager: SessionManager,
): Promise<UserSession<T> | undefined> {
  if (message.body.trim() === '0') {
    session.step -= 2;
    session.back = true;
  } else if (message.body.trim() === '99') {
    sessionManager.delete(message.from);
    await client.sendMessage(
      message.from,
      '🚮 Su sesión ha sido eliminada correctamente',
    );
    await client.sendSeen(message.from);
    return;
  }
  return session;
}
