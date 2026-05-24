import { SeeBusEnumCommands } from '@features/see-bus/enum/commands.enum';
import { seeBusBackSteps } from '@features/see-bus/see-bus.command';
import { SegmentAlertEnumCommands } from '@features/see-bus/segment-alert/enum/commands.enum';
import { segmentAlertBackSteps } from '@features/see-bus/segment-alert/subscribe-segment-alert.command';
import { SumarDosNumerosEnumCommands } from '@features/sumar-dos-numeros/enum/commands.enum';
import { sumarDosNumerosBackSteps } from '@features/sumar-dos-numeros/sumar-dos-numeros.command';
import { SeeTicketsEnumCommand } from '@features/sudcinemas-vm/see-tickets/enum/commands.enum';
import { seeTicketsBackSteps } from '@features/sudcinemas-vm/see-tickets/see-tickets.command';
import { SessionManager } from '@session/session-manager';
import { UserSession } from '@session/user-session.interface';
import { backOneSession } from './back-one-session.util';

describe('backOneSession', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses sumarDosNumeros back steps', async () => {
    const session: UserSession = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
        SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
        SumarDosNumerosEnumCommands.LAST_STEP,
      ],
      backSteps: sumarDosNumerosBackSteps,
      data: {},
    };

    await backOneSession(
      { from: 'user-1', body: '0' } as any,
      whatsapp as any,
      session,
      new SessionManager(),
    );

    expect(session.steps).toEqual([
      SumarDosNumerosEnumCommands.FIRST_NUMBER,
      SumarDosNumerosEnumCommands.SECOND_NUMBER,
    ]);
    expect(session.back).toBe(true);
  });

  it('uses see bus back steps', async () => {
    const session: UserSession = {
      commandName: 'verColectivos',
      steps: [
        SeeBusEnumCommands.SEE_BUS_INIT_STATE,
        SeeBusEnumCommands.SEE_BUS_ORIGIN_STATE,
        SeeBusEnumCommands.SEE_BUS_DESTINATION_STATE,
        SeeBusEnumCommands.SEE_BUS_MAP_STATE,
      ],
      backSteps: seeBusBackSteps,
      data: {},
    };

    await backOneSession(
      { from: 'user-1', body: '0' } as any,
      whatsapp as any,
      session,
      new SessionManager(),
    );

    expect(session.steps).toEqual([
      SeeBusEnumCommands.SEE_BUS_INIT_STATE,
      SeeBusEnumCommands.SEE_BUS_ORIGIN_STATE,
    ]);
    expect(session.back).toBe(true);
  });

  it('uses see tickets back steps', async () => {
    const session: UserSession = {
      commandName: 'verEntradas',
      steps: [
        SeeTicketsEnumCommand.GET_USER_MOVIE_STATE,
        SeeTicketsEnumCommand.GET_USER_SHOWTIME_STATE,
        SeeTicketsEnumCommand.SEND_USER_SHOWTIMES_STATE,
        SeeTicketsEnumCommand.LAST_STEP,
      ],
      backSteps: seeTicketsBackSteps,
      data: {},
    };

    await backOneSession(
      { from: 'user-1', body: '0' } as any,
      whatsapp as any,
      session,
      new SessionManager(),
    );

    expect(session.steps).toEqual([
      SeeTicketsEnumCommand.GET_USER_MOVIE_STATE,
      SeeTicketsEnumCommand.GET_USER_SHOWTIME_STATE,
    ]);
    expect(session.back).toBe(true);
  });

  it('uses segment alert back steps', async () => {
    const session: UserSession = {
      commandName: 'suscribirmeTramo',
      steps: [
        SegmentAlertEnumCommands.INIT,
        SegmentAlertEnumCommands.ORIGIN,
        SegmentAlertEnumCommands.DESTINATION,
        SegmentAlertEnumCommands.LINE_AND_SENSE,
      ],
      backSteps: segmentAlertBackSteps,
      data: {},
    };

    await backOneSession(
      { from: 'user-1', body: '0' } as any,
      whatsapp as any,
      session,
      new SessionManager(),
    );

    expect(session.steps).toEqual([
      SegmentAlertEnumCommands.INIT,
      SegmentAlertEnumCommands.ORIGIN,
    ]);
    expect(session.back).toBe(true);
  });

  it('keeps one-pop fallback when a session has no declared back step', async () => {
    const session: UserSession = {
      commandName: 'unknown',
      steps: ['first', 'second', 'third'],
      data: {},
    };

    await backOneSession(
      { from: 'user-1', body: '0' } as any,
      whatsapp as any,
      session,
      new SessionManager(),
    );

    expect(session.steps).toEqual(['first', 'second']);
    expect(session.back).toBe(true);
  });
});
