import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { SessionModule } from '@session/session.module';
import { WhatsappModule } from '@application/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    WhatsappModule,
    SessionModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
