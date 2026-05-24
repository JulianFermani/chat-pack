import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageMedia } from 'whatsapp-web.js';

import { WhatsappService } from '@client/whatsapp.service';
import { SocialLinkDetectorService } from '../social-link-detector.service';
import { SocialDownloadPolicyService } from '../social-download-policy.service';
import { YtDlpDownloaderService } from '../yt-dlp-downloader.service';
import { buildSocialDownloadErrorMessage } from './social-download-errors';

@Injectable()
export class SocialDownloadHandler {
  private readonly logger = new Logger(SocialDownloadHandler.name);

  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly detector: SocialLinkDetectorService,
    private readonly policy: SocialDownloadPolicyService,
    private readonly downloader: YtDlpDownloaderService,
  ) {}

  async handle(message: Message): Promise<void> {
    const url = this.detector.extractFirstSupportedUrl(message.body ?? '');
    if (!url) {
      return;
    }

    const isGroup = message.from.endsWith('@g.us');
    if (!this.policy.shouldHandle(isGroup)) {
      return;
    }

    const maxFileMb = this.policy.getMaxFileMb();
    let tempDir: string | undefined;

    await this.whatsapp.sendMessage(
      message.from,
      '*[⏳]* Descargando el contenido...',
    );

    try {
      const result = await this.downloader.download({
        url,
        ytDlpPath: this.policy.getYtDlpPath(),
        baseTempDir: this.policy.getTempDir(),
        maxFileMb,
        timeoutMs: this.policy.getTimeoutMs(),
      });
      tempDir = result.tempDir;

      const media = MessageMedia.fromFilePath(result.filePath);
      await this.whatsapp.sendMediaWithCaption(
        message.from,
        media,
        result.caption,
      );
    } catch (error) {
      this.logger.warn(
        `No se pudo descargar contenido social para ${message.from}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      await this.whatsapp.sendMessage(
        message.from,
        buildSocialDownloadErrorMessage(error, maxFileMb),
      );
    } finally {
      if (tempDir) {
        try {
          await this.downloader.cleanup(tempDir);
        } catch (error) {
          this.logger.warn(
            `No se pudo limpiar descarga temporal ${tempDir}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
    }
  }
}
