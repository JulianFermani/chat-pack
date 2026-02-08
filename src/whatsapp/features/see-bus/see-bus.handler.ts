import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeBusesData } from './see-bus.session';
import { Injectable } from '@nestjs/common';
import { SeeBusStateFactory } from './states/see-bus-state.factory';

@Injectable()
export class SeeBusHandler {
  constructor(private readonly stateFactory: SeeBusStateFactory) {}
  async handle(
    message: Message,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession<SeeBusesData> | void> {
    const state = this.stateFactory.get(session.step);
    if (!state) {
      return;
    }

    return state.handle(message, session);
  }
}
