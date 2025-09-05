import { forwardRef, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CommandRegistry } from './command-registry';
import { ConfigModule } from '@nestjs/config';
import { CommandHandlerService } from './command-handler.service';
import { whatsappClientProvider } from './whatsapp.provider';
import { HolaModule } from '../features/hola/hola.module';
import { SessionManager } from '../session/session-manager';

@Module({
  imports: [
    forwardRef(() => HolaModule),
    // forwardRef(() => CommandModule),
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
