import axios from 'axios';

import {
  TinBalanceFetcherService,
  extractBalanceFromTinInfo,
} from './tin-balance-fetcher.service';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('extractBalanceFromTinInfo', () => {
  it('returns the current usage balance from the first message item', () => {
    const balance = extractBalanceFromTinInfo({
      success: true,
      message: [
        {
          saldo_uso: '15854.00',
        },
      ],
    });

    expect(balance).toBe('15854.00');
  });

  it('throws when the provider reports an unsuccessful response', () => {
    expect(() =>
      extractBalanceFromTinInfo({ success: false, message: [] }),
    ).toThrow('Respuesta invalida del servicio de TIN.');
  });

  it('throws when message has no items', () => {
    expect(() =>
      extractBalanceFromTinInfo({ success: true, message: [] }),
    ).toThrow('Respuesta invalida del servicio de TIN.');
  });

  it('throws when the first message item has no usage balance', () => {
    expect(() =>
      extractBalanceFromTinInfo({ success: true, message: [{}] }),
    ).toThrow('Respuesta invalida del servicio de TIN.');
  });
});

describe('TinBalanceFetcherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts the printed card number to the recarga online endpoint', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: [{ saldo_uso: '15854.00' }],
      },
    });

    const service = new TinBalanceFetcherService();
    const balance = await service.fetchCurrentBalance('1596322');

    expect(balance).toBe('15854.00');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://micronauta.dnsalias.net/usuario/recarga_online/cmd.php',
      {
        action: 'info',
        documento: '',
        numeroTarjeta: '1596322',
        recursive: 0,
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: '*/*',
          'Content-Type': 'application/json',
          Origin: 'https://micronauta.dnsalias.net',
          Referer:
            'https://micronauta.dnsalias.net/usuario/recarga_online/info.php?a=245&t=0',
        }),
      }),
    );
  });
});
