import { Command } from '@shared/interfaces/command.interface';
import { getEmojiForCommand } from '@shared/utils/number-format.util';

export function getCommandBuilderMessage(commands: Command[]): string {
  return commands
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
    .map((command) => {
      const emoji = getEmojiForCommand(command.name);
      return `${emoji} */${command.name}*\n${command.description}`;
    })
    .join('\n\n');
}
