type Poster = {
  id: number;
  path: string;
};

type Movie = {
  codigoPelicula: string;
  pref: string;
  nombre: string;
  Condicion: string;
  formato: string;
  lenguaje: string;
  release: number; // 0 o 1 según estado de lanzamiento
  preSale: number; // 0 o 1 según preventa
  poster: Poster;
};

// Tipo para la respuesta completa
export type MovieResponse = {
  status: string;
  data: Movie[];
};
