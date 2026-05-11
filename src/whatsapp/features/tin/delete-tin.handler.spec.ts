import { DeleteTinHandler } from './delete-tin.handler';

describe('DeleteTinHandler', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
  };

  const tinCardService = {
    deleteTinByChatId: jest.fn(),
  };

  let handler: DeleteTinHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new DeleteTinHandler(whatsapp as any, tinCardService as any);
  });

  it('rejects group chats', async () => {
    await handler.handle({ from: 'group@g.us', body: '/eliminarTin' } as any);

    expect(tinCardService.deleteTinByChatId).not.toHaveBeenCalled();
    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'group@g.us',
      'Este comando solo se puede usar en chats privados.',
    );
  });

  it('reports when there is no tin to delete', async () => {
    tinCardService.deleteTinByChatId.mockResolvedValue('not-found');

    await handler.handle({ from: 'user@c.us', body: '/eliminarTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'No tenes una tarjeta TIN registrada para eliminar.',
    );
  });

  it('deletes the registered tin', async () => {
    tinCardService.deleteTinByChatId.mockResolvedValue('deleted');

    await handler.handle({ from: 'user@c.us', body: '/eliminarTin' } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      'Listo. Elimine tu tarjeta TIN registrada.',
    );
  });
});
