import { Message } from 'whatsapp-web.js';

export interface MessageContext {
  userId: string;
  body: string;
  normalizedText: string;
  isCommand: boolean;
  commandName?: string;
  isGroup: boolean;
  isMedia: boolean;
  message: Message;
}
