import { Message } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';
import { SessionManager } from '@session/session-manager';
import { UserSession } from '@session/user-session.interface';

export async function backOneSession<T>(
  message: Message,
  whatsappClient: WhatsappService,
  session: UserSession<T>,
  sessionManager: SessionManager,
): Promise<UserSession<T> | undefined> {
  if (message.body.trim() === '0') {
    for (let i = 0; i <= 2; i++) {
      session.steps.pop();
    }
    session.back = true;
  } else if (message.body.trim() === '99') {
    sessionManager.delete(message.from);
    await whatsappClient.sendMessage(
      message.from,
      '🚮 Su sesión ha sido eliminada correctamente',
    );
    return;
  }
  return session;
}
