import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionCleaner } from './whatsapp/session/session-cleaner';
import { WhatsappModule } from './whatsapp/application/whatsapp.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    WhatsappModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
  ],
  controllers: [],
  providers: [SessionCleaner],
})
export class AppModule {}
