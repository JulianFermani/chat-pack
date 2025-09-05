import { forwardRef, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CommandRegistry } from './command-registry';
import { ConfigModule } from '@nestjs/config';
import { CommandHandlerService } from './command-handler.service';
import { whatsappClientProvider } from './whatsapp.provider';
import { HolaModule } from '../features/hola/hola.module';
import { SessionManager } from '../session/session-manager';
import { CommandModule } from '../features/get-commands/get-command.module';
import { SeeMoviesModule } from '../features/sudcinemas-vm/see-movies/see-movies.module';
import { SeeTicketsModule } from '../features/sudcinemas-vm/see-tickets/see-tickets.module';
import { SumarDosNumerosModule } from '../features/sumar-dos-numeros/sumar-dos-numeros.module';

@Module({
  imports: [
    forwardRef(() => HolaModule),
    forwardRef(() => CommandModule),
    forwardRef(() => SeeMoviesModule),
    forwardRef(() => SeeTicketsModule),
    forwardRef(() => SumarDosNumerosModule),
    ConfigModule,
  ],
  providers: [
    WhatsappService,
    CommandHandlerService,
    CommandRegistry,
    whatsappClientProvider,
    SessionManager,
  ],
  exports: [WhatsappService, CommandRegistry],
})
export class WhatsappModule {}
