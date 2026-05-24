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
      '🔒 Este comando solo se puede usar en chats privados.',
    );
  });

  it('asks to register when no tin exists', async () => {
    tinCardService.findTinByChatId.mockResolvedValue(undefined);

    await handler.handle({ from: 'user@c.us', body: '/verTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '💳 No tenes una tarjeta registrada. Usa */registrarTin 1596322*.',
    );
  });

  it('shows the registered tin', async () => {
    tinCardService.findTinByChatId.mockResolvedValue('1596322');

    await handler.handle({ from: 'user@c.us', body: '/verTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '💳 Tu numero de tarjeta TIN registrado es: 1596322',
    );
  });
});
