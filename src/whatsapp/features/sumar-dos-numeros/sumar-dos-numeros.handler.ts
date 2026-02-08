import { SumarDosNumerosData } from './sumar-dos-numeros.session';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';
import { Injectable } from '@nestjs/common';
import { SumarDosNumerosStateFactory } from './states/sumar-dos-numeros-state.factory';

@Injectable()
export class SumarDosNumerosHandler {
  constructor(private readonly stateFactory: SumarDosNumerosStateFactory) {}
  async handle(
    message: Message,
    session: UserSession<SumarDosNumerosData>,
  ): Promise<UserSession<SumarDosNumerosData> | void> {
    const state = this.stateFactory.get(session.step);
    if (!state) {
      return;
    }
    return state.handle(message, session);
  }
}
