import { OnModuleInit } from '@nestjs/common';
import { Command } from './command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { UserSession } from 'src/whatsapp/session/user-session.interface';
import { Message } from 'whatsapp-web.js';

export abstract class AbstractCommand<T = any>
  implements Command<T>, OnModuleInit
{
  abstract name: string;
  abstract description: string;
  abstract usesSession: boolean;

  constructor(private readonly registry: CommandRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  abstract execute(
    message: Message,
    session: UserSession<T>,
  ): Promise<UserSession<T> | void>;
}
