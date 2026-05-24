import { SessionManager } from '@session/session-manager';
import { backOneSession } from '@shared/utils/back-one-session.util';
import { SumarDosNumerosEnumCommands } from './enum/commands.enum';
import { sumarDosNumerosBackSteps } from './sumar-dos-numeros.command';
import { SumarDosNumerosHandler } from './sumar-dos-numeros.handler';
import { AddTwoNumbersState } from './states/add-two-numbers.state';
import { FirstNumberState } from './states/first-number.state';
import { SecondNumberState } from './states/second-number.state';
import { SumarDosNumerosStateFactory } from './states/sumar-dos-numeros-state.factory';

describe('SumarDosNumerosHandler back navigation', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('goes back from second number input to first number input', async () => {
    const handler = new SumarDosNumerosHandler(
      new SumarDosNumerosStateFactory(
        new FirstNumberState(whatsapp as any),
        new SecondNumberState(whatsapp as any),
        new AddTwoNumbersState(whatsapp as any),
      ),
    );
    const message = { from: 'user-1', body: '0' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
        SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
      ],
      backSteps: sumarDosNumerosBackSteps,
      data: { num1: 7 },
    } as any;

    const backedSession = await backOneSession(
      message,
      whatsapp as any,
      session,
      new SessionManager(),
    );
    const updated = await handler.handle(message, backedSession as any);

    expect(updated).toBe(session);
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Por favor, envía el primer número:',
    );
    expect(session.steps).toEqual([
      SumarDosNumerosEnumCommands.FIRST_NUMBER,
      SumarDosNumerosEnumCommands.SECOND_NUMBER,
    ]);
    expect(session.back).toBe(false);
  });

  it('goes back from result to second number input', async () => {
    const handler = new SumarDosNumerosHandler(
      new SumarDosNumerosStateFactory(
        new FirstNumberState(whatsapp as any),
        new SecondNumberState(whatsapp as any),
        new AddTwoNumbersState(whatsapp as any),
      ),
    );
    const message = { from: 'user-1', body: '0' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
        SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
        SumarDosNumerosEnumCommands.LAST_STEP,
      ],
      backSteps: sumarDosNumerosBackSteps,
      data: { num1: 7, num2: 3 },
    } as any;

    const backedSession = await backOneSession(
      message,
      whatsapp as any,
      session,
      new SessionManager(),
    );
    const updated = await handler.handle(message, backedSession as any);

    expect(updated).toBe(session);
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Ahora envía el segundo número:',
    );
    expect(session.steps).toEqual([
      SumarDosNumerosEnumCommands.FIRST_NUMBER,
      SumarDosNumerosEnumCommands.SECOND_NUMBER,
      SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
    ]);
    expect(session.back).toBe(false);
  });
});
