import { Message, Client } from 'whatsapp-web.js';
import { Command } from 'src/whatsapp/domain/commands/interfaces/command.interface';
import { UserSession } from '../../session/user-session.interface';
import { SeeMoviesHandler } from './see-movies.handler';

export class SeeMoviesCommand implements Command {
  name = 'verPeliculas';
  description =
    'Muestra todas las películas en cartelera del cine SudCinemas Villa María.';
  usesSession = false;

  async execute(message: Message, client: Client): Promise<UserSession | void> {
    await SeeMoviesHandler.handle(message, client);
  }
}
