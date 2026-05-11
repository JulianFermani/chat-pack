import { SecondNumberState } from './second-number.state';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

describe('SecondNumberState', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  let state: SecondNumberState;

  beforeEach(() => {
    jest.clearAllMocks();
    state = new SecondNumberState(whatsapp as any);
  });

  it('stores first number, asks for second and advances flow', async () => {
    const message = { from: 'user-1', body: '10' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
      ],
      data: {},
      back: false,
    } as any;

    const updated = await state.handle(message, session);

    expect(updated).toBe(session);
    expect(session.data.num1).toBe(10);
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Ahora envía el segundo número:',
    );
    expect(session.steps.at(-1)).toBe(
      SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
    );
    expect(session.back).toBe(false);
  });

  it('keeps same step when first number is invalid', async () => {
    const message = { from: 'user-1', body: 'abc' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
      ],
      data: {},
      back: false,
    } as any;

    const updated = await state.handle(message, session);

    expect(updated).toBe(session);
    expect(session.data.num1).toBeUndefined();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'No es un número válido. Intenta de nuevo:',
    );
    expect(session.steps).toHaveLength(2);
  });

  it('uses saved first number when coming back in session flow', async () => {
    const message = { from: 'user-1', body: '999' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
      ],
      data: { num1: 7 },
      back: true,
    } as any;

    await state.handle(message, session);

    expect(session.data.num1).toBe(7);
    expect(session.steps.at(-1)).toBe(
      SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
    );
    expect(session.back).toBe(false);
  });
});
