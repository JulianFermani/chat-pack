import { Module } from '@nestjs/common';
import { CommandRegistry } from './command-registry';

@Module({
  imports: [],
  controllers: [],
  providers: [CommandRegistry],
  exports: [CommandRegistry],
})
export class CommandRegistryModule {}
