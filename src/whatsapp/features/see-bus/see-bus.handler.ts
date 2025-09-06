import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeBusesData } from './see-bus.session';
import { seeBusInit } from './services/see-bus-init.service';
import { seeBusOrigin } from './services/see-bus-origin.service';
import { seeBusDestination } from './services/see-bus-destination.service';
import { seeBusMap } from './services/see-bus-map.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

@Injectable()
export class SeeBusHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}
  async handle(
    message: Message,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession<SeeBusesData> | void> {
    switch (session.step) {
      case 1:
        return seeBusInit(message, this.whatsappClient, session);
      case 2:
        return seeBusOrigin(message, this.whatsappClient, session);
      case 3:
        return seeBusDestination(message, this.whatsappClient, session);
      case 4:
        return seeBusMap(message, this.whatsappClient, session);
    }
  }
}
