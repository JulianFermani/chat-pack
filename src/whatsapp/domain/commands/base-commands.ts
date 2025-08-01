import { HolaCommand } from './hola.command';
import { StickerDirectMessageCommand } from './sticker-direct-message.command';
import { StickerGroupMessageCommand } from './sticker-group-message.command';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SeeMoviesCommand } from './see-movies.command';
import { Command } from './interfaces/command.interface';
import { SeeTicketsCommand } from './see-tickets.command';
import { SeeBusCommand } from './see-bus.command';

export const baseCommandList: Command[] = [
  new HolaCommand(),
  new StickerDirectMessageCommand(),
  new StickerGroupMessageCommand(),
  new SumarDosNumerosCommand(),
  new SeeMoviesCommand(),
  new SeeTicketsCommand(),
  new SeeBusCommand(),
];
