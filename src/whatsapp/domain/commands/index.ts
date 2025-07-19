import { HolaCommand } from './hola.command';
import { StickerDirectMessageCommand } from './sticker-direct-message.command';
import { StickerGroupMessageCommand } from './sticker-group-message.command';
import { SumarDosNumerosCommand } from './sumar-dos-numeros.command';
import { SeeMoviesCommand } from './see-movies.command';
import { GetCommandsCommand } from './get-commands.command';
import { CommandRegistry } from 'src/whatsapp/command-registry';

export const commandList = [
  new HolaCommand(),
  new StickerDirectMessageCommand(),
  new StickerGroupMessageCommand(),
  new SumarDosNumerosCommand(),
  new SeeMoviesCommand(),
  new GetCommandsCommand(new CommandRegistry()),
];
