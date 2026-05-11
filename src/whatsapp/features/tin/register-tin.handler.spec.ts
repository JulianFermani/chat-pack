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
      body: '/registrarTin EA2F1101',
    } as any);

    expect(tinCardService.registerTin).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'group@g.us',
      'Este comando solo se puede usar en chats privados.',
    );
  });

  it('rejects invalid command format', async () => {
    await handler.handle({ from: 'user@c.us', body: '/registrarTin' } as any);

    expect(tinCardService.registerTin).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Formato invalido. Usa */registrarTin EA2F1101*.',
    );
  });

  it('registers a new tin', async () => {
    tinCardService.registerTin.mockResolvedValue('created');

    await handler.handle({
      from: 'user@c.us',
      body: '/registrarTin ea2f1101',
    } as any);

    expect(tinCardService.registerTin).toHaveBeenCalledWith(
      'user@c.us',
      'EA2F1101',
    );
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Listo. Registre tu tarjeta TIN EA2F1101.',
    );
  });

  it('updates an existing tin', async () => {
    tinCardService.registerTin.mockResolvedValue('updated');

    await handler.handle({
      from: 'user@c.us',
      body: '/registrarTin EA2F1101',
    } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Listo. Actualice tu tarjeta TIN a EA2F1101.',
    );
  });
});
