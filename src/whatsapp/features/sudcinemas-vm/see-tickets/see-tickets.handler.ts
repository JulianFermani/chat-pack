import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeTicketsData } from './see-tickets.session';
import { SeeTicketsStateFactory } from './states/see-tickets-state.factory';
import { UserSession } from '@session/user-session.interface';

@Injectable()
export class SeeTicketsHandler {
  constructor(private readonly stateFactory: SeeTicketsStateFactory) {}
  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    const lastState = session.steps.at(-1);
    if (!lastState) return;
    const state = this.stateFactory.get(lastState);
    if (!state) {
      return;
    }

    return state.handle(message, session);
  }
}
