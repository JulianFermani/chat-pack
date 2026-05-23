import axios from 'axios';

import { Injectable } from '@nestjs/common';

interface TinTripRecord {
  saldo_uso?: string;
}

const TIN_BALANCE_URL =
  'https://micronauta.dnsalias.net/usuario/recarga_online/cmd.php';

export function extractBalanceFromTinInfo(payload: unknown): string {
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
          Origin: 'https://micronauta.dnsalias.net',
          Referer:
            'https://micronauta.dnsalias.net/usuario/recarga_online/info.php?a=245&t=0',
        },
      },
    );

    return extractBalanceFromTinInfo(response.data);
  }
}
