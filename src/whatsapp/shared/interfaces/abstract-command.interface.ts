import { Message } from 'whatsapp-web.js';

import { OnModuleInit } from '@nestjs/common';

import { Command } from './command.interface';
import { CommandRegistry } from '@command-registry/command-registry';
import { UserSession } from '@session/user-session.interface';

export abstract class AbstractCommand<T = any>
  implements Command<T>, OnModuleInit
{
  abstract name: string;
  abstract description: string;
  abstract usesSession: boolean;
  firstStep: string;

  constructor(private readonly registry: CommandRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  abstract execute(
    message: Message,
    session: UserSession<T>,
  ): Promise<UserSession<T> | void>;
}
