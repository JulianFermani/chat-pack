import { CommandResolverService } from './command-resolver.service';
import { MessageContext } from '@command-handler/interfaces/message-context.interface';

describe('CommandResolverService', () => {
  const commandRegistry = {
    get: jest.fn(),
  };

  const whatsappClient = {
    sendMessage: jest.fn(),
  };

  let service: CommandResolverService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommandResolverService(
      commandRegistry as any,
      whatsappClient as any,
    );
  });

  function buildContext(partial?: Partial<MessageContext>): MessageContext {
    return {
      userId: 'user-1',
      body: '/hola',
      normalizedText: '/hola',
      isCommand: true,
      commandName: 'hola',
      isGroup: false,
      isMedia: false,
      message: { from: 'user-1', body: '/hola' } as any,
      ...partial,
    };
  }

  it('returns command when slash command exists', async () => {
    const command = { name: 'hola' };
    commandRegistry.get.mockReturnValue(command);

    const result = await service.resolve(buildContext());

    expect(commandRegistry.get).toHaveBeenCalledWith('hola');
    expect(result).toBe(command);
    expect(whatsappClient.sendMessage).not.toHaveBeenCalled();
  });

  it('sends unknown command message when command does not exist', async () => {
    commandRegistry.get.mockReturnValue(undefined);

    const result = await service.resolve(
      buildContext({ commandName: 'inexistente' }),
    );

    expect(result).toBeUndefined();
    expect(whatsappClient.sendMessage).toHaveBeenCalledWith(
      'user-1',
      'Comando desconocido: inexistente, para ver la lista de comandos envie */comandos*',
    );
  });

  it('resolves media command for group chats', async () => {
    const mediaCommand = { name: 'sticker-group' };
    commandRegistry.get.mockReturnValue(mediaCommand);

    const result = await service.resolve(
      buildContext({ isCommand: false, isMedia: true, isGroup: true }),
    );

    expect(commandRegistry.get).toHaveBeenCalledWith('stickergroupmessage');
    expect(result).toBe(mediaCommand);
  });

  it('resolves media command for direct chats', async () => {
    const mediaCommand = { name: 'sticker-direct' };
    commandRegistry.get.mockReturnValue(mediaCommand);

    const result = await service.resolve(
      buildContext({ isCommand: false, isMedia: true, isGroup: false }),
    );

    expect(commandRegistry.get).toHaveBeenCalledWith('stickerdirectmessage');
    expect(result).toBe(mediaCommand);
  });

  it('returns undefined when message is neither command nor media', async () => {
    const result = await service.resolve(
      buildContext({
        isCommand: false,
        isMedia: false,
        commandName: undefined,
        body: 'hola',
        normalizedText: 'hola',
      }),
    );

    expect(result).toBeUndefined();
    expect(commandRegistry.get).not.toHaveBeenCalledWith('hola');
  });
});
