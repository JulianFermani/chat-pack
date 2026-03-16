import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { MessageContext } from '@command-handler/interfaces/message-context.interface';
import { CommandRegistry } from '@command-registry/command-registry';

@Injectable()
export class CommandResolverService {
  constructor(
    private readonly commandRegistry: CommandRegistry,
    private readonly whatsappClient: WhatsappService,
  ) {}

  async resolve(ctx: MessageContext) {
    if (ctx.isCommand && ctx.commandName) {
      const cmd = this.commandRegistry.get(ctx.commandName);
      if (!cmd) {
        await this.whatsappClient.sendMessage(
          ctx.userId,
          `Comando desconocido: ${ctx.commandName}, para ver la lista de comandos envie */comandos*`,
        );
        await this.whatsappClient.sendSeen(ctx.userId);
        return undefined;
      }
      return cmd;
    }

    if (ctx.isMedia) {
      const key = ctx.isGroup ? 'stickergroupmessage' : 'stickerdirectmessage';
      return this.commandRegistry.get(key);
    }

    return undefined;
  }
}
