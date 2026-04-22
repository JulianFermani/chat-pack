import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseModule } from './database/database.module';
import { SessionModule } from '@session/session.module';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { CommandModule } from '@features/get-commands/get-command.module';
import { FootballModule } from '@features/football/football.module';
import { HolaModule } from '@features/hola/hola.module';
import { SeeBusModule } from '@features/see-bus/see-bus.module';
import { StickerDirectMessageModule } from '@features/stickers/sticker-direct-message/sticker-direct-message.module';
import { StickerGroupMessageModule } from '@features/stickers/sticker-group-message/sticker-group-message.module';
import { SeeMoviesModule } from '@features/sudcinemas-vm/see-movies/see-movies.module';
import { SeeTicketsModule } from '@features/sudcinemas-vm/see-tickets/see-tickets.module';
import { SumarDosNumerosModule } from '@features/sumar-dos-numeros/sumar-dos-numeros.module';
import { CommandHandlerModule } from '@command-handler/command-handler.module';
import { TelegramMonitorModule } from './monitoring/telegram-monitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    DatabaseModule,
    CommandHandlerModule,
    CommandRegistryModule,
    WhatsappModule,
    TelegramMonitorModule,
    SessionModule,
    HolaModule,
    CommandModule,
    SeeMoviesModule,
    SeeTicketsModule,
    SumarDosNumerosModule,
    SeeBusModule,
    FootballModule,
    StickerDirectMessageModule,
    StickerGroupMessageModule,
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
