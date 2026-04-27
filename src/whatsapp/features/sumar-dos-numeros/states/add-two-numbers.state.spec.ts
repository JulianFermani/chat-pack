import { AddTwoNumbersState } from './add-two-numbers.state';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

describe('AddTwoNumbersState', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  let state: AddTwoNumbersState;

  beforeEach(() => {
    jest.clearAllMocks();
    state = new AddTwoNumbersState(whatsapp as any);
  });

  it('keeps same step when second number is invalid', async () => {
    const message = { from: 'user-1', body: 'nope' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
        SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
      ],
      data: { num1: 10 },
    } as any;

    const updated = await state.handle(message, session);

    expect(updated).toBe(session);
    expect(session.data.num2).toBeUndefined();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'No es un número válido. Intenta de nuevo:',
    );
    expect(session.steps).toHaveLength(3);
  });

  it('calculates result, sends summary and pushes last step', async () => {
    const message = { from: 'user-1', body: '5' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [
        SumarDosNumerosEnumCommands.FIRST_NUMBER,
        SumarDosNumerosEnumCommands.SECOND_NUMBER,
        SumarDosNumerosEnumCommands.ADD_TWO_NUMBERS,
      ],
      data: { num1: 10 },
    } as any;

    const updated = await state.handle(message, session);

    expect(updated).toBe(session);
    expect(session.data.num2).toBe(5);
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      expect.stringContaining('El resultado de la suma es: 15'),
    );
    expect(session.steps.at(-1)).toBe(SumarDosNumerosEnumCommands.LAST_STEP);
  });
});
