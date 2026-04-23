import { buildTodaysGamesMessage } from './see-todays-games.presenter';
import { PromiedosLeague } from '../services/todays-games-fetcher.service';

describe('buildTodaysGamesMessage', () => {
  it('renders league and game details with score and tv channels', () => {
    const leagues: PromiedosLeague[] = [
      {
        name: 'Liga Profesional',
        games: [
          {
            stage_round_name: 'Fecha 1',
            teams: [{ name: 'River', short_name: 'RIV' }, { name: 'Boca', short_name: 'BOC' }],
            status: { name: 'Finalizado', short_name: 'FT' },
            start_time: '2026-04-23 21:00',
            scores: [2, 1],
            game_time_status_to_display: 'Final',
            tv_networks: [{ name: 'ESPN' }, { name: 'TNT Sports' }],
          },
        ],
      },
    ];

    const message = buildTodaysGamesMessage(leagues);

    expect(message).toContain('🏆 *Liga Profesional*');
    expect(message).toContain('🏟️ Fecha 1');
    expect(message).toContain('⏰ 21:00 | *River vs Boca*');
    expect(message).toContain('📌 Final (2-1)');
    expect(message).toContain('📺 ESPN, TNT Sports');
  });

  it('falls back to status short name and omits score/tv when missing', () => {
    const leagues: PromiedosLeague[] = [
      {
        name: 'Copa',
        games: [
          {
            teams: [{ name: 'Equipo A', short_name: 'A' }, { name: 'Equipo B', short_name: 'B' }],
            status: { name: 'Programado', short_name: 'PPD' },
            start_time: '2026-04-23 18:30',
          },
        ],
      },
    ];

    const message = buildTodaysGamesMessage(leagues);

    expect(message).toContain('⏰ 18:30 | *Equipo A vs Equipo B*');
    expect(message).toContain('📌 PPD');
    expect(message).not.toContain('📺');
    expect(message).not.toContain('()');
  });
});
