import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Client, Message } from 'whatsapp-web.js';
import { SeeBusesData } from './see-bus.session';
import { seeBusInit } from './services/see-bus-init.service';
import { seeBusOrigin } from './services/see-bus-origin.service';
import { seeBusDestination } from './services/see-bus-destination.service';
import { seeBusMap } from './services/see-bus-map.service';

export class SeeBusHandler {
  static async handle(
    message: Message,
    client: Client,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession<SeeBusesData> | void> {
    switch (session.step) {
      case 1:
        return seeBusInit(message, client, session);
      case 2:
        return seeBusOrigin(message, client, session);
      case 3:
        return seeBusDestination(message, client, session);
      case 4:
        return seeBusMap(message, client, session);
    }
  }
}
