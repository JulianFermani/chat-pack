import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { UserSession } from '@session/user-session.interface';
import { SegmentAlertStateFactory } from './states/segment-alert-state.factory';
import { SegmentAlertSessionData } from './segment-alert.session';

@Injectable()
export class SegmentAlertHandler {
  constructor(private readonly stateFactory: SegmentAlertStateFactory) {}

  async handle(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ): Promise<UserSession<SegmentAlertSessionData> | void> {
    const lastState = session.steps.at(-1);
    if (!lastState) {
      return;
    }

    const state = this.stateFactory.get(lastState);
    if (!state) {
      return;
    }

    return state.handle(message, session);
  }
}
