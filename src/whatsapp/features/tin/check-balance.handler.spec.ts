import { CheckBalanceHandler } from './check-balance.handler';

describe('CheckBalanceHandler', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  const tinCardService = {
    findTinByChatId: jest.fn(),
  };

  const tinBalanceFetcher = {
    fetchCurrentBalance: jest.fn(),
  };

  let handler: CheckBalanceHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new CheckBalanceHandler(
      whatsapp as any,
      tinCardService as any,
      tinBalanceFetcher as any,
    );
  });

  it('rejects group chats', async () => {
    await handler.handle({
      from: 'group@g.us',
      body: '/consultarSaldo',
    } as any);

    expect(tinCardService.findTinByChatId).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'group@g.us',
      'Este comando solo se puede usar en chats privados.',
    );
  });

  it('asks to register a tin when none exists', async () => {
    tinCardService.findTinByChatId.mockResolvedValue(undefined);

    await handler.handle({ from: 'user@c.us', body: '/consultarSaldo' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'No tenes una tarjeta registrada. Usa */registrarTin EA2F1101*.',
    );
  });

  it('reports when balance cannot be found', async () => {
    tinCardService.findTinByChatId.mockResolvedValue('EA2F1101');
    tinBalanceFetcher.fetchCurrentBalance.mockResolvedValue(undefined);

    await handler.handle({ from: 'user@c.us', body: '/consultarSaldo' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'No pude obtener el saldo actual de la tarjeta TIN EA2F1101.',
    );
  });

  it('returns the current balance', async () => {
    tinCardService.findTinByChatId.mockResolvedValue('EA2F1101');
    tinBalanceFetcher.fetchCurrentBalance.mockResolvedValue('13754.00');

    await handler.handle({ from: 'user@c.us', body: '/consultarSaldo' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Saldo actual de tu tarjeta TIN EA2F1101: $13.754,00',
    );
  });

  it('returns a friendly error when the provider fails', async () => {
    tinCardService.findTinByChatId.mockResolvedValue('EA2F1101');
    tinBalanceFetcher.fetchCurrentBalance.mockRejectedValue(new Error('boom'));

    await handler.handle({ from: 'user@c.us', body: '/consultarSaldo' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'No pude consultar el saldo en este momento. Intenta de nuevo mas tarde.',
    );
  });
});
