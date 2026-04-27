import { getCommandBuilderMessage } from './get-commands.presenter';

describe('getCommandBuilderMessage', () => {
  it('builds a readable message for each command', () => {
    const message = getCommandBuilderMessage([
      {
        name: 'registrarTin',
        description: 'Registra tu TIN',
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
      {
        name: 'hola',
        description: 'Saluda al usuario',
        usesSession: false,
        firstStep: '',
        execute: jest.fn(),
      },
    ]);

    expect(message).toContain('📜 */comandos*\nLista todos los comandos');
    expect(message).toContain('🗣️ */hola*\nSaluda al usuario');
    expect(message).toContain('🪪 */registrarTin*\nRegistra tu TIN');
    expect(message).toContain('\n\n');
    expect(message.indexOf('*/comandos*')).toBeLessThan(
      message.indexOf('*/hola*'),
    );
    expect(message.indexOf('*/hola*')).toBeLessThan(
      message.indexOf('*/registrarTin*'),
    );
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

    expect(message).toContain('🔧 */algo-nuevo*');
  });
});
