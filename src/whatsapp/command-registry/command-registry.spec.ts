import { CommandRegistry } from './command-registry';
import { Command } from '@shared/interfaces/command.interface';

describe('CommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = new CommandRegistry();
  });

  function makeCommand(name: string): Command {
    return {
      name,
      description: `${name} description`,
      usesSession: false,
      firstStep: '',
      execute: jest.fn(),
    };
  }

  it('registers a command and returns it by name', () => {
    const command = makeCommand('hola');

    registry.register(command);

    expect(registry.get('hola')).toBe(command);
    expect(registry.getAll()).toEqual([command]);
  });

  it('resolves command names case-insensitively', () => {
    const command = makeCommand('VerPartidosHoy');
    registry.register(command);

    expect(registry.get('verpartidoshoy')).toBe(command);
    expect(registry.get('VERPARTIDOSHOY')).toBe(command);
  });

  it('ignores duplicate command names', () => {
    const first = makeCommand('comandos');
    const duplicate = makeCommand('Comandos');

    registry.register(first);
    registry.register(duplicate);

    expect(registry.getAll()).toHaveLength(1);
    expect(registry.get('comandos')).toBe(first);
  });
});
