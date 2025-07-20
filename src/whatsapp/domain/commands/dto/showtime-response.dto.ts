export type FechaHora = {
  date: string;
  timezone_type: string;
  timezone: string;
};

export type Showtimes = {
  id: string;
  fref: string;
  lenguaje: string;
  formato: string;
  fechaHora: FechaHora;
  vender: string;
  mostrar: string;
  maxVentas: string;
  PrecioButacasEspeciales: string;
  today: boolean;
  expired: boolean;
  vendidas: number;
  disponibles: number;
};

export type FechaEstreno = {
  date: string;
  timezone_type: string;
  timezone: string;
};

export type Pelicula = {
  id: string;
  codigoPelicula: string;
  pref: string;
  nombre: string;
  abreviatura: string;
  descripcion: string;
  datosTecnicos: string;
  urlTrailer: string;
  vender: string;
  mostrar: string;
  idCine: string;
  Duracion: string;
  Condicion: string;
  FechaEstreno: FechaEstreno;
  minutosHabilitados: string;
  poster: string;
};

export type MovieAndShowtime = {
  movie: Pelicula;
  showtimes: Showtimes[];
};

export type ResponseShowtimes = {
  status: string;
  data: MovieAndShowtime;
};
