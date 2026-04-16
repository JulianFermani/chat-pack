import axios from 'axios';

const PROMIEDOS_TODAY_GAMES_URL = 'https://api.promiedos.com.ar/games/today';

const PROMIEDOS_HEADERS = {
  'X-Ver': '1.11.7.5',
  Origin: 'https://www.promiedos.com.ar',
  Referer: 'https://www.promiedos.com.ar/',
  'User-Agent': 'Mozilla/5.0',
};

interface PromiedosStatus {
  name: string;
  short_name: string;
}

interface PromiedosTvNetwork {
  name: string;
}

interface PromiedosTeam {
  name: string;
  short_name: string;
}

export interface PromiedosGame {
  stage_round_name?: string;
  teams: PromiedosTeam[];
  status: PromiedosStatus;
  start_time: string;
  scores?: number[];
  game_time_status_to_display?: string;
  tv_networks?: PromiedosTvNetwork[];
}

export interface PromiedosLeague {
  name: string;
  games: PromiedosGame[];
}

interface PromiedosTodayGamesResponse {
  leagues: PromiedosLeague[];
}

export async function libertadoresGamesFetcher(): Promise<PromiedosLeague | null> {
  const { data } = await axios.get<PromiedosTodayGamesResponse>(
    PROMIEDOS_TODAY_GAMES_URL,
    {
      headers: PROMIEDOS_HEADERS,
    },
  );

  return (
    data.leagues.find((league) =>
      league.name.toLowerCase().includes('libertadores'),
    ) ?? null
  );
}
