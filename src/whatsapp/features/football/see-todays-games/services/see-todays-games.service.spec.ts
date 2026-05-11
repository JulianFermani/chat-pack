import { SeeTodaysGamesService } from './see-todays-games.service';

describe('SeeTodaysGamesService', () => {
  const whatsappClient = {
    sendMessage: jest.fn(),
  };

  const todaysGamesFetcherService = {
    fetch: jest.fn(),
  };

  let service: SeeTodaysGamesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SeeTodaysGamesService(
      whatsappClient as any,
      todaysGamesFetcherService as any,
    );
  });

  it('builds empty-day fallback when no leagues are available', async () => {
    todaysGamesFetcherService.fetch.mockResolvedValue([]);

    const summary = await service.buildTodaysGamesSummary();

    expect(summary).toBe(
      '⚽ *Partidos de hoy*\n\nHoy no hay partidos programados.',
    );
  });

  it('builds full summary when leagues are available', async () => {
    todaysGamesFetcherService.fetch.mockResolvedValue([
      {
        name: 'Liga Profesional',
        games: [
          {
            stage_round_name: 'Fecha 1',
            teams: [
              { name: 'River', short_name: 'RIV' },
              { name: 'Boca', short_name: 'BOC' },
            ],
            status: { name: 'Finalizado', short_name: 'FT' },
            start_time: '2026-04-23 21:00',
            scores: [2, 1],
          },
        ],
      },
    ]);

    const summary = await service.buildTodaysGamesSummary();

    expect(summary).toContain('⚽ *Partidos de hoy*');
    expect(summary).toContain('🏆 *Liga Profesional*');
    expect(summary).toContain('*River vs Boca*');
  });

  it('returns generic error message when fetch fails', async () => {
    todaysGamesFetcherService.fetch.mockRejectedValue(new Error('network'));

    const summary = await service.buildTodaysGamesSummary();

    expect(summary).toBe('No pude consultar los partidos de hoy en este momento.');
  });

  it('sends prebuilt summary to target chat', async () => {
    await service.sendPrebuiltSummary('chat-1', 'mensaje listo');

    expect(whatsappClient.sendMessage).toHaveBeenCalledWith(
      'chat-1',
      'mensaje listo',
    );
  });

  it('builds and sends summary in one flow', async () => {
    todaysGamesFetcherService.fetch.mockResolvedValue([]);

    await service.sendTodaysGamesSummary('chat-1');

    expect(whatsappClient.sendMessage).toHaveBeenCalledWith(
      'chat-1',
      '⚽ *Partidos de hoy*\n\nHoy no hay partidos programados.',
    );
  });
});
