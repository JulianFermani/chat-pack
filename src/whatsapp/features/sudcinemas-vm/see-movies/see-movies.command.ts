import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { SeeMoviesHandler } from './see-movies.handler';
import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';
import { AbstractCommand } from '@shared/interfaces/abstract-command.interface';

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
