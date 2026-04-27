import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { backOrDelete } from '@shared/utils/back-or-delete-message.util';
import { busSetter } from '../../infra/bus-setter.service';
import { seeBusCookieFetcher } from '../../infra/cookie-fetcher.service';
import { originPlacesFetcher } from '../../infra/origin-places-fetcher.service';
import { SegmentAlertEnumCommands } from '../enum/commands.enum';
import { SegmentAlertSessionData } from '../segment-alert.session';

type LoginData = {
  cmd: string;
  conf: string;
  tkn: string;
};

@Injectable()
export class SegmentAlertInitState implements State<SegmentAlertSessionData> {
  readonly stepId = SegmentAlertEnumCommands.INIT;

  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly config: ConfigService,
  ) {}

  async handle(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ) {
    const cookie = await seeBusCookieFetcher();

    const apiUrl = this.config.get<string>('SEE_BUS_BASE_URL');
    let url = `${apiUrl}?conf=elporvenir`;

    const originPlacesResponse = await originPlacesFetcher(cookie, url);

    url = `${apiUrl}buscador_cmd.php`;

    const data: LoginData = { cmd: 'isLogin', conf: 'elporvenir', tkn: 'null' };
    await busSetter(cookie, url, data);

    let messageText = `🚏 Envia el numero del origen del tramo:\n${originPlacesResponse.messageText}`;
    messageText = backOrDelete(messageText);

    await this.whatsapp.sendMessage(message.from, messageText);

    session.data.originPlaces = originPlacesResponse.places;
    session.data.cookie = cookie;
    session.steps.push(SegmentAlertEnumCommands.ORIGIN);
    session.back = false;

    return session;
  }
}
