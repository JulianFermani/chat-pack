import { OnModuleInit } from '@nestjs/common';
import { Command } from './command.interface';
import { CommandRegistry } from 'src/whatsapp/application/command-registry';
import { UserSession } from 'src/whatsapp/session/user-session.interface';

export abstract class AbstractCommand implements Command, OnModuleInit {
  abstract name: string;
  abstract description: string;
  abstract usesSession: boolean;

  constructor(private readonly registry: CommandRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  abstract execute(message: any): Promise<UserSession | void>;
}
