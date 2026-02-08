import { Message } from 'whatsapp-web.js';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { SeeMoviesHandler } from './see-movies.handler';
import { AbstractCommand } from 'src/whatsapp/shared/interfaces/abstract-command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeeMoviesCommand extends AbstractCommand {
  name = 'verPeliculas';
  description =
    'Muestra todas las películas en cartelera del cine SudCinemas Villa María.';
  usesSession = false;

  constructor(
    registry: CommandRegistry,
    private readonly handler: SeeMoviesHandler,
  ) {
    super(registry);
  }

  async execute(message: Message): Promise<UserSession | void> {
    return this.handler.handle(message);
  }
}
