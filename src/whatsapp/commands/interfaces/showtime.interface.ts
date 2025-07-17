import { FechaHora } from '../dto/showtime-response.dto';

export interface Showtime {
  lenguaje: string;
  formato: string;
  fechaHora: FechaHora;
  maxVentas: string;
  vendidas: number;
  disponibles: number;
}
