import axios from 'axios';

import { Injectable } from '@nestjs/common';

interface TinTripRecord {
  mov_tarjeta_saldo?: string;
}

const TIN_BALANCE_URL = 'https://wext6.dnsalias.net/tarjeta/index.php';

export function extractBalanceFromTrips(payload: unknown): string | undefined {
  if (!Array.isArray(payload)) {
    throw new Error('Respuesta invalida del servicio de TIN.');
  }

  if (payload.length === 0) {
    return undefined;
  }

  const [latestTrip] = payload as TinTripRecord[];
  const balance = latestTrip?.mov_tarjeta_saldo;

  if (typeof balance !== 'string' || balance.trim() === '') {
    throw new Error('Respuesta invalida del servicio de TIN.');
  }

  return balance.trim();
}

@Injectable()
export class TinBalanceFetcherService {
  async fetchCurrentBalance(tin: string): Promise<string | undefined> {
    const postData = new URLSearchParams();
    postData.append('cmd', 'consultar_tin_viajes');
    postData.append('uid', tin);

    const response = await axios.post<unknown>(
      TIN_BALANCE_URL,
      postData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return extractBalanceFromTrips(response.data);
  }
}
