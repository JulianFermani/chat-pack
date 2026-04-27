import { SessionFlowService } from './session-flow.service';
import { backOneSession } from '@shared/utils/back-one-session.util';

jest.mock('@shared/utils/back-one-session.util', () => ({
  backOneSession: jest.fn(),
}));

describe('SessionFlowService', () => {
  const commandRegistry = {
    get: jest.fn(),
  };

  const whatsappClient = {
    sendMessage: jest.fn(),
  };

  const sessionManager = {
    set: jest.fn(),
    delete: jest.fn(),
  };

  const commandExecuterService = {
    executeCommandFlow: jest.fn(),
  };

  let service: SessionFlowService;
  const mockedBackOneSession = backOneSession as jest.MockedFunction<
    typeof backOneSession
  >;

  const ctx = {
    userId: 'user-1',
    body: 'hola',
    normalizedText: 'hola',
    isCommand: false,
    isGroup: false,
    isMedia: false,
    message: { from: 'user-1', body: 'hola' } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SessionFlowService(
      commandRegistry as any,
      whatsappClient as any,
      sessionManager as any,
      commandExecuterService as any,
    );
  });

  it('returns early when backOneSession removes the session', async () => {
    mockedBackOneSession.mockResolvedValue(undefined);
    const session = { commandName: 'hola', steps: ['s1'], data: {} };

    await service.handleExistingSession(ctx as any, session as any);

    expect(commandRegistry.get).not.toHaveBeenCalled();
  });

  it('warns when session has no commandName', async () => {
    mockedBackOneSession.mockResolvedValue({ steps: ['s1'], data: {} } as any);
    const warnSpy = jest
      .spyOn((service as any).logger, 'warn')
      .mockImplementation();

    await service.handleExistingSession(ctx as any, {
      commandName: '',
      steps: ['s1'],
      data: {},
    });

    expect(warnSpy).toHaveBeenCalledWith('Sesión sin commandName para user-1');
    expect(commandRegistry.get).not.toHaveBeenCalled();
  });

  it('deletes session and notifies when command is missing', async () => {
    mockedBackOneSession.mockResolvedValue({
      commandName: 'inexistente',
      steps: ['s1'],
      data: {},
    } as any);
    commandRegistry.get.mockReturnValue(undefined);

    await service.handleExistingSession(ctx as any, {
      commandName: 'inexistente',
      steps: ['s1'],
      data: {},
    });

    expect(sessionManager.delete).toHaveBeenCalledWith('user-1');
    expect(whatsappClient.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Error: comando no encontrado, para ver la lista de comandos envie */comandos*',
    );
  });

  it('updates stored session when command returns updated session', async () => {
    const session = {
      commandName: 'sumarDosNumeros',
      steps: ['s1'],
      data: {},
    };
    const updated = {
      commandName: 'sumarDosNumeros',
      steps: ['s2'],
      data: { firstNumber: 5 },
    };

    mockedBackOneSession.mockResolvedValue(session as any);
    commandRegistry.get.mockReturnValue({
      execute: jest.fn().mockResolvedValue(updated),
    });

    await service.handleExistingSession(ctx as any, session as any);

    expect(sessionManager.set).toHaveBeenCalledWith('user-1', updated);
  });

  it('deletes stored session when command returns nothing', async () => {
    const session = {
      commandName: 'sumarDosNumeros',
      steps: ['s1'],
      data: {},
    };

    mockedBackOneSession.mockResolvedValue(session as any);
    commandRegistry.get.mockReturnValue({
      execute: jest.fn().mockResolvedValue(undefined),
    });

    await service.handleExistingSession(ctx as any, session as any);

    expect(sessionManager.delete).toHaveBeenCalledWith('user-1');
  });
});
