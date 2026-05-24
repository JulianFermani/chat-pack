import { RegisterTinHandler } from './register-tin.handler';

describe('RegisterTinHandler', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  const tinCardService = {
    registerTin: jest.fn(),
  };

  let handler: RegisterTinHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new RegisterTinHandler(whatsapp as any, tinCardService as any);
  });

  it('rejects group chats', async () => {
    await handler.handle({
      from: 'group@g.us',
      body: '/registrarTin 1596322',
    } as any);

    expect(tinCardService.registerTin).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'group@g.us',
      '🔒 Este comando solo se puede usar en chats privados.',
    );
  });

  it('rejects invalid command format', async () => {
    await handler.handle({ from: 'user@c.us', body: '/registrarTin' } as any);

    expect(tinCardService.registerTin).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '⚠️ Formato invalido. Usa */registrarTin 1596322*.',
    );
  });

  it('rejects the old alphanumeric card code', async () => {
    await handler.handle({
      from: 'user@c.us',
      body: '/registrarTin EA2F1101',
    } as any);

    expect(tinCardService.registerTin).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '⚠️ Formato invalido. Usa */registrarTin 1596322*.',
    );
  });

  it('registers a new tin', async () => {
    tinCardService.registerTin.mockResolvedValue('created');

    await handler.handle({
      from: 'user@c.us',
      body: '/registrarTin 1596322',
    } as any);

    expect(tinCardService.registerTin).toHaveBeenCalledWith(
      'user@c.us',
      '1596322',
    );
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '✅ Listo. Registre tu numero de tarjeta TIN 1596322.',
    );
  });

  it('updates an existing tin', async () => {
    tinCardService.registerTin.mockResolvedValue('updated');

    await handler.handle({
      from: 'user@c.us',
      body: '/registrarTin 1596322',
    } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '✅ Listo. Actualice tu numero de tarjeta TIN a 1596322.',
    );
  });
});
