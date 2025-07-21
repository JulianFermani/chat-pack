import { Message, Client } from 'whatsapp-web.js';
import { Command } from './interfaces/command.interface';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { getSeeBusCookie } from './services/cookie-fetcher.service';
import { setSelectBusiness } from './services/select-business.service';
import { setSelectLine } from './services/select-line.service';

export class SeeBusCommand implements Command {
  name = 'verColectivo';
  description =
    'Responde con la ubicación del Villa del Rosario, desde Tio Pujio a Villa Maria';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await client.sendMessage(message.from, 'Cargando ubicación...');
    const cookie = await getSeeBusCookie();
    console.log(`Cookie:${cookie}`);
    console.log(await setSelectBusiness(cookie));
    console.log(`======= TERMINO SELECT BUSINESS =======`);
    console.log(await setSelectLine(cookie));
    return;
  }
}
