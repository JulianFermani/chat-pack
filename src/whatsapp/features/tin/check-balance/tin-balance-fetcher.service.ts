import axios from 'axios';

import { Injectable } from '@nestjs/common';

interface TinTripRecord {
  saldo_uso?: string;
}

const TIN_BALANCE_URL =
  'https://micronauta.dnsalias.net/usuario/recarga_online/cmd.php';
const TIN_INFO_URL =
  'https://micronauta.dnsalias.net/usuario/recarga_online/info.php?a=245&t=0';
const TIN_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';

export function extractBalanceFromTinInfo(payload: unknown): string {
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      throw new Error('Respuesta invalida del servicio de TIN.');
    }
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Respuesta invalida del servicio de TIN.');
  }

  const response = payload as { success?: unknown; message?: unknown };
  if (response.success !== true || !Array.isArray(response.message)) {
    throw new Error('Respuesta invalida del servicio de TIN.');
  }

  const [tinInfo] = response.message as TinTripRecord[];
  const balance = tinInfo?.saldo_uso;

  if (typeof balance !== 'string' || balance.trim() === '') {
    throw new Error('Respuesta invalida del servicio de TIN.');
  }

  return balance.trim();
}

@Injectable()
export class TinBalanceFetcherService {
  async fetchCurrentBalance(tin: string): Promise<string | undefined> {
    const sessionResponse = await axios.get(TIN_INFO_URL, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': TIN_USER_AGENT,
      },
    });
    const sessionCookie = sessionResponse.headers['set-cookie']
      ?.map((cookie) => cookie.split(';')[0])
      .join('; ');

    const response = await axios.post<unknown>(
      TIN_BALANCE_URL,
      {
        action: 'info',
        documento: '',
        numeroTarjeta: tin,
        recursive: 0,
      },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
          Origin: 'https://micronauta.dnsalias.net',
          Referer: TIN_INFO_URL,
          'User-Agent': TIN_USER_AGENT,
        },
      },
    );

    return extractBalanceFromTinInfo(response.data);
  }
}
