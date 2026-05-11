import { extractBalanceFromTrips } from './tin-balance-fetcher.service';

describe('extractBalanceFromTrips', () => {
  it('returns the current balance from the latest trip', () => {
    const balance = extractBalanceFromTrips([
      {
        mov_tarjeta_saldo: '13754.00',
      },
    ]);

    expect(balance).toBe('13754.00');
  });

  it('returns undefined when there are no trips', () => {
    expect(extractBalanceFromTrips([])).toBeUndefined();
  });

  it('throws when payload is not an array', () => {
    expect(() => extractBalanceFromTrips({})).toThrow(
      'Respuesta invalida del servicio de TIN.',
    );
  });

  it('throws when the first trip has no balance', () => {
    expect(() => extractBalanceFromTrips([{}])).toThrow(
      'Respuesta invalida del servicio de TIN.',
    );
  });
});
