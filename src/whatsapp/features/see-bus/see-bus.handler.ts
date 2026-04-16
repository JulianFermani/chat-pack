import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeBusesData } from './see-bus.session';
import { SeeBusStateFactory } from './states/see-bus-state.factory';
import { UserSession } from '@session/user-session.interface';

@Injectable()
export class SeeBusHandler {
  constructor(private readonly stateFactory: SeeBusStateFactory) {}
  async handle(
    message: Message,
    session: UserSession<SeeBusesData>,
  ): Promise<UserSession<SeeBusesData> | void> {
    const lastState = session.steps.at(-1);
    if (!lastState) return;
    const state = this.stateFactory.get(lastState);
    if (!state) {
      return;
    }
    return state.handle(message, session);
  }
}
