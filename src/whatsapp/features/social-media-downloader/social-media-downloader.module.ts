import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';
import { SocialDownloadCommand } from './social-download/social-download.command';
import { SocialDownloadHandler } from './social-download/social-download.handler';
import { SocialDownloadPolicyService } from './social-download-policy.service';
import { SocialLinkDetectorService } from './social-link-detector.service';
import { YtDlpDownloaderService } from './yt-dlp-downloader.service';

@Module({
  imports: [ConfigModule, WhatsappModule, CommandRegistryModule],
  providers: [
    SocialDownloadCommand,
    SocialDownloadHandler,
    SocialDownloadPolicyService,
    SocialLinkDetectorService,
    YtDlpDownloaderService,
  ],
  exports: [SocialDownloadCommand, SocialLinkDetectorService],
})
export class SocialMediaDownloaderModule {}
