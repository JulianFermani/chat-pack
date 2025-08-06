import { HolaCommand } from 'src/whatsapp/features/hola/hola.command';
import { StickerDirectMessageCommand } from './features/stickers/sticker-direct-message/sticker-direct-message.command';
import { StickerGroupMessageCommand } from './features/stickers/sticker-group-message/sticker-group-message.command';
import { SumarDosNumerosCommand } from './features/sumar-dos-numeros/sumar-dos-numeros.command';
import { SeeMoviesCommand } from './features/sudcinemas-vm/see-movies/see-movies.command';
import { Command } from './shared/interfaces/command.interface';
import { SeeTicketsCommand } from './features/sudcinemas-vm/see-tickets/see-tickets.command';
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
