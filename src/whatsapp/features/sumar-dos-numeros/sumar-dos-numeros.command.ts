import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';

export class SumarDosNumerosCommand implements Command<SumarDosNumerosData> {
  name = 'sumarDosNumeros';
  description = 'Realiza la suma de dos números en dos pasos interactivos.';
  usesSession = true;

  async execute(
    message: Message,
    client: Client,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    return SumarDosNumerosHandler.handle(message, client, session);
  }
}
