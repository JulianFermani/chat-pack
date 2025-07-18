import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp/application/whatsapp.service';
import { CommandHandlerService } from './whatsapp/application/command-handler.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [WhatsappService, CommandHandlerService],
})
export class AppModule {}
