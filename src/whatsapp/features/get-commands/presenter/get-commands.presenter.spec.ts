import { getCommandBuilderMessage } from './get-commands.presenter';

describe('getCommandBuilderMessage', () => {
  it('builds a readable message for each command', () => {
    const message = getCommandBuilderMessage([
      {
        name: 'hola',
        description: 'Saluda al usuario',
        usesSession: false,
        firstStep: '',
        execute: jest.fn(),
      },
      {
        name: 'comandos',
        description: 'Lista todos los comandos',
        usesSession: false,
        firstStep: '',
        execute: jest.fn(),
      },
    ]);

    expect(message).toContain('🗣️ Comando: */hola*');
    expect(message).toContain('📝 Descripción: Saluda al usuario');
    expect(message).toContain('📜 Comando: */comandos*');
    expect(message).toContain('📝 Descripción: Lista todos los comandos');
    expect(message).toContain('\n\n');
  });

  it('uses default emoji for unknown commands', () => {
    const message = getCommandBuilderMessage([
      {
        name: 'algo-nuevo',
        description: 'Comando nuevo',
        usesSession: false,
        firstStep: '',
        execute: jest.fn(),
      },
    ]);

    expect(message).toContain('🔧 Comando: */algo-nuevo*');
  });
});
