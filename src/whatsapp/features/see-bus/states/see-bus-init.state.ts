import { Injectable } from '@nestjs/common';
import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';
import { State } from '../../../shared/interfaces/state.interface';
import { SeeBusesData } from '../see-bus.session';
import { seeBusCookieFetcher } from '../infra/cookie-fetcher.service';
import { originPlacesFetcher } from '../infra/origin-places-fetcher.service';
import { busSetter } from '../infra/bus-setter.service';
import { backOrDelete } from 'src/whatsapp/shared/utils/back-or-delete-message.util';
import { ConfigService } from '@nestjs/config';

type Data = {
  cmd: string;
  conf: string;
  tkn: string;
};

@Injectable()
export class SeeBusInitState implements State<SeeBusesData> {
  readonly stepId = 1;
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly config: ConfigService,
  ) {}
  async handle(message: Message, session: UserSession<SeeBusesData>) {
    const cookie = await seeBusCookieFetcher();

    const apiUrl = this.config.get<string>('SEE_BUS_BASE_URL');
    let url = `${apiUrl}?conf=elporvenir`;

    const originPlacesResponse = await originPlacesFetcher(cookie, url);

    url = `${apiUrl}buscador_cmd.php`;

    const data: Data = { cmd: 'isLogin', conf: 'elporvenir', tkn: 'null' };

    await busSetter(cookie, url, data);

    if (
      originPlacesResponse.messageText === null ||
      originPlacesResponse.places === null
    ) {
      await this.whatsapp.sendMessage(
        message.from,
        `😞 No se encontraron origenes`,
      );
      return;
    }

    let messageText = `🚏 Enviá el número desde dónde salis: \n${originPlacesResponse.messageText}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.originPlaces = originPlacesResponse.places;
    session.step = 2;
    session.data.cookie = cookie;
    session.back = false;
    return session;
  }
}
