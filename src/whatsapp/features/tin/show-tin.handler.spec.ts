import { ShowTinHandler } from './show-tin.handler';

describe('ShowTinHandler', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  const tinCardService = {
    findTinByChatId: jest.fn(),
  };

  let handler: ShowTinHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new ShowTinHandler(whatsapp as any, tinCardService as any);
  });

  it('rejects group chats', async () => {
    await handler.handle({ from: 'group@g.us', body: '/verTin' } as any);

    expect(tinCardService.findTinByChatId).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'group@g.us',
      'Este comando solo se puede usar en chats privados.',
    );
  });

  it('asks to register when no tin exists', async () => {
    tinCardService.findTinByChatId.mockResolvedValue(undefined);

    await handler.handle({ from: 'user@c.us', body: '/verTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'No tenes una tarjeta registrada. Usa */registrarTin EA2F1101*.',
    );
  });

  it('shows the registered tin', async () => {
    tinCardService.findTinByChatId.mockResolvedValue('EA2F1101');

    await handler.handle({ from: 'user@c.us', body: '/verTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Tu tarjeta TIN registrada es: EA2F1101',
    );
  });
});
