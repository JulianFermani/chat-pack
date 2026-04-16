import { Injectable } from '@nestjs/common';

@Injectable()
export class FootballMenuPresenter {
  build(): string {
    return [
      '⚽ *Futbol*',
      '',
      'Estos comandos son posibles:',
      '1. /verPartidosHoy',
      '2. /suscribirmePartidosHoy',
      '3. /desuscribirmePartidosHoy',
      '',
      'Responde con 1, 2 o 3, o envia el comando directamente.',
      'Envia 99 para salir.',
    ].join('\n');
  }
}
