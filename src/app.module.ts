import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp/application/whatsapp.service';
import { CommandHandlerService } from './whatsapp/application/command-handler.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { SessionManager } from './whatsapp/session/session-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionCleaner } from './whatsapp/session/session-cleaner';
import { WhatsappModule } from './whatsapp/application/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    WhatsappModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    WhatsappService,
    CommandHandlerService,
    SessionManager,
    SessionCleaner,
  ],
})
export class AppModule {}
