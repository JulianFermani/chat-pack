import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { SeeTicketsData } from './see-tickets.session';
import { Injectable } from '@nestjs/common';
import { SeeTicketsStateFactory } from './states/see-tickets-state.factory';

@Injectable()
export class SeeTicketsHandler {
  constructor(private readonly stateFactory: SeeTicketsStateFactory) {}
  async handle(
    message: Message,
    session: UserSession<SeeTicketsData>,
  ): Promise<UserSession<SeeTicketsData> | void> {
    const state = this.stateFactory.get(session.step);
    if (!state) {
      return;
    }

    return state.handle(message, session);
  }
}
