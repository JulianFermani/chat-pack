import { CommandExecuterService } from './command-executer.service';

describe('CommandExecuterService', () => {
  const sessionManager = {
    set: jest.fn(),
    delete: jest.fn(),
  };

  const whatsappClient = {
    sendMessage: jest.fn(),
  };

  let service: CommandExecuterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommandExecuterService(
      sessionManager as any,
      whatsappClient as any,
    );
  });

  const ctx = {
    userId: 'user-1',
    body: '/cmd',
    normalizedText: '/cmd',
    isCommand: true,
    commandName: 'cmd',
    isGroup: false,
    isMedia: false,
    message: { from: 'user-1', body: '/cmd' } as any,
  };

  it('creates initial session and executes command flow for session commands', async () => {
    const command = {
      name: 'sumarDosNumeros',
      usesSession: true,
      firstStep: 'first-number',
      execute: jest.fn().mockResolvedValue({
        commandName: 'sumarDosNumeros',
        steps: ['second-number'],
        data: { firstNumber: 10 },
      }),
    };

    await service.executeCommandFlow(ctx as any, command as any);

    expect(sessionManager.set).toHaveBeenNthCalledWith(
      1,
      'user-1',
      expect.objectContaining({
        commandName: 'sumarDosNumeros',
        steps: ['first-number'],
      }),
    );
    expect(command.execute).toHaveBeenCalled();
    expect(sessionManager.set).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        steps: ['second-number'],
      }),
    );
  });

  it('executes non-session commands without creating session', async () => {
    const command = {
      name: 'hola',
      usesSession: false,
      firstStep: '',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    await service.executeCommandFlow(ctx as any, command as any);

    expect(command.execute).toHaveBeenCalledWith(ctx.message);
    expect(sessionManager.set).not.toHaveBeenCalled();
  });

  it('deletes session when executeCommandAndPersist returns undefined', async () => {
    const command = {
      name: 'cmd',
      usesSession: true,
      firstStep: 'step-1',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    await service.executeCommandAndPersist(command as any, ctx.message as any, {
      commandName: 'cmd',
      steps: ['step-1'],
      data: {},
    });

    expect(sessionManager.delete).toHaveBeenCalledWith('user-1');
  });

  it('sends error message when command execution throws', async () => {
    const command = {
      name: 'cmd',
      usesSession: false,
      firstStep: '',
      execute: jest.fn().mockRejectedValue(new Error('boom')),
    };

    await service.executeCommandFlow(ctx as any, command as any);

    expect(whatsappClient.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Error ejecutando el comando.',
    );
  });
});
