import {
  PromiedosGame,
  PromiedosLeague,
} from '../services/todays-games-fetcher.service';

function getDisplayTime(startTime: string): string {
  return startTime.split(' ')[1] ?? startTime;
}

function getDisplayStatus(game: PromiedosGame): string {
  return game.game_time_status_to_display?.trim() || game.status.short_name;
}

function getDisplayScore(game: PromiedosGame): string {
  if (!game.scores || game.scores.length < 2) {
    return '';
  }

  return ` (${Number(game.scores[0])}-${Number(game.scores[1])})`;
}

function getDisplayTvNetworks(game: PromiedosGame): string | null {
  const channels = game.tv_networks?.map((network) => network.name).join(', ');
  return channels || null;
}

function buildGameMessage(game: PromiedosGame): string {
  const homeTeam = game.teams[0]?.name ?? game.teams[0]?.name ?? 'Local';
  const awayTeam = game.teams[1]?.name ?? game.teams[1]?.name ?? 'Visitante';

  const lines = [
    game.stage_round_name ? `🏟️ ${game.stage_round_name}` : null,
    `⏰ ${getDisplayTime(game.start_time)} | *${homeTeam} vs ${awayTeam}*`,
    `📌 ${getDisplayStatus(game)}${getDisplayScore(game)}`,
    getDisplayTvNetworks(game) ? `📺 ${getDisplayTvNetworks(game)}` : null,
  ].filter(Boolean);

  return lines.join('\n');
}

function buildLeagueMessage(league: PromiedosLeague): string {
  return [
    `🏆 *${league.name}*`,
    league.games.map((game) => buildGameMessage(game)).join('\n\n'),
  ].join('\n\n');
}

export function buildTodaysGamesMessage(leagues: PromiedosLeague[]): string {
  return leagues.map((league) => buildLeagueMessage(league)).join('\n\n');
}
