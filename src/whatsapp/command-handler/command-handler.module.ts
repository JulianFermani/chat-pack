import { Module } from '@nestjs/common';

import { CommandHandlerService } from './command-handler.service';
import {
  CommandExecuterService,
  CommandResolverService,
  SessionFlowService,
} from './services';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { SessionModule } from '@session/session.module';
import { SocialMediaDownloaderModule } from '@features/social-media-downloader/social-media-downloader.module';
@Module({
  imports: [
    WhatsappModule,
    SessionModule,
    CommandRegistryModule,
    SocialMediaDownloaderModule,
  ],
  controllers: [],
  providers: [
    CommandExecuterService,
    CommandHandlerService,
    CommandResolverService,
    SessionFlowService,
  ],
  exports: [],
})
export class CommandHandlerModule {}
