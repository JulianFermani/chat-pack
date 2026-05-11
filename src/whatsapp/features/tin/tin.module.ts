import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { CheckBalanceCommand } from './check-balance.command';
import { CheckBalanceHandler } from './check-balance.handler';
import { DeleteTinCommand } from './delete-tin.command';
import { DeleteTinHandler } from './delete-tin.handler';
import { RegisterTinCommand } from './register-tin.command';
import { RegisterTinHandler } from './register-tin.handler';
import { ShowTinCommand } from './show-tin.command';
import { ShowTinHandler } from './show-tin.handler';
import { TinCardService } from './tin-card.service';
import { TinCardRepository } from './tin-card.repository';
import { TinBalanceFetcherService } from './services/tin-balance-fetcher.service';
import { tinCardModelProvider } from './tin-card.provider';

@Module({
  imports: [DatabaseModule, WhatsappModule, CommandRegistryModule],
  providers: [
    tinCardModelProvider,
    TinCardRepository,
    TinCardService,
    TinBalanceFetcherService,
    RegisterTinCommand,
    RegisterTinHandler,
    ShowTinCommand,
    ShowTinHandler,
    DeleteTinCommand,
    DeleteTinHandler,
    CheckBalanceCommand,
    CheckBalanceHandler,
  ],
})
export class TinModule {}
