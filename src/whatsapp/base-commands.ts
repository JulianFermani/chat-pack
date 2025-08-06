import { HolaCommand } from 'src/whatsapp/features/hola/hola.command';
import { StickerDirectMessageCommand } from './domain/commands/sticker-direct-message.command';
import { StickerGroupMessageCommand } from './domain/commands/sticker-group-message.command';
import { SumarDosNumerosCommand } from './features/sumar-dos-numeros/sumar-dos-numeros.command';
import { SeeMoviesCommand } from 'src/whatsapp/features/see-movies/see-movies.command';
import { Command } from './shared/interfaces/command.interface';
import { SeeTicketsCommand } from './domain/commands/see-tickets.command';
import { SeeBusCommand } from './domain/commands/see-bus.command';

export const baseCommandList: Command[] = [
  new HolaCommand(),
  new StickerDirectMessageCommand(),
  new StickerGroupMessageCommand(),
  new SumarDosNumerosCommand(),
  new SeeMoviesCommand(),
  new SeeTicketsCommand(),
  new SeeBusCommand(),
];
