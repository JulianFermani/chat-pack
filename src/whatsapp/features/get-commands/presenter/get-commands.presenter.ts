import { Command } from 'src/whatsapp/shared/interfaces/command.interface';
import { getEmojiForCommand } from 'src/whatsapp/shared/utils/number-format.util';

export function getCommandBuilderMessage(commands: Command[]): string {
  return commands
    .map((command) => {
      const emoji = getEmojiForCommand(command.name);
      return `${emoji} Comando: */${command.name}*\n📝 Descripción: ${command.description}`;
    })
    .join('\n\n');
}
