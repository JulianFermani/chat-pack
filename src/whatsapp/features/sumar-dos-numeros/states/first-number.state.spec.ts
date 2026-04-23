import { FirstNumberState } from './first-number.state';
import { SumarDosNumerosEnumCommands } from '../enum/commands.enum';

describe('FirstNumberState', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  let state: FirstNumberState;

  beforeEach(() => {
    jest.clearAllMocks();
    state = new FirstNumberState(whatsapp as any);
  });

  it('asks for first number and advances to second step', async () => {
    const message = { from: 'user-1', body: 'hola' } as any;
    const session = {
      commandName: 'sumarDosNumeros',
      steps: [SumarDosNumerosEnumCommands.FIRST_NUMBER],
      data: {},
      back: true,
    } as any;

    const updated = await state.handle(message, session);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Por favor, envía el primer número:',
    );
    expect(updated).toBe(session);
    expect(session.steps).toEqual([
      SumarDosNumerosEnumCommands.FIRST_NUMBER,
      SumarDosNumerosEnumCommands.SECOND_NUMBER,
    ]);
    expect(session.back).toBe(false);
  });
});
