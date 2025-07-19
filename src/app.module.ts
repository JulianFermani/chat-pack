import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp/application/whatsapp.service';
import { CommandHandlerService } from './whatsapp/application/command-handler.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { CommandModule } from './whatsapp/command-module';
import { SessionManager } from './whatsapp/session/session-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    CommandModule,
  ],
  controllers: [],
  providers: [WhatsappService, CommandHandlerService, SessionManager],
})
export class AppModule {}
