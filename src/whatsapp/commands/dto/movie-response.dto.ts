export type Poster = {
  id: number;
  path: string;
};

export type Pelicula = {
  codigoPelicula: string;
  pref: string;
  nombre: string;
  Condicion: string;
  formato: string;
  lenguaje: string;
  release: number;
  preSale: number;
  poster: Poster;
};

export type ResponsePeliculas = {
  status: string;
  data: Pelicula[];
};
