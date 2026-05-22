import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';

import { SocialDownloadError } from './social-download-errors';

export interface SocialDownloadRequest {
  url: string;
  baseTempDir: string;
  maxFileMb: number;
  timeoutMs: number;
}

export interface SocialDownloadResult {
  filePath: string;
  caption: string;
  tempDir: string;
}

interface YtDlpMetadata {
  description?: string;
  title?: string;
}

@Injectable()
export class YtDlpDownloaderService {
  async download(request: SocialDownloadRequest): Promise<SocialDownloadResult> {
    await mkdir(request.baseTempDir, { recursive: true });
    const tempDir = await mkdtemp(join(request.baseTempDir, 'download-'));

    try {
      const metadata = await this.fetchMetadata(request);
      await this.downloadMedia(request, tempDir);
      const filePath = await this.resolveDownloadedFile(tempDir);

      return {
        filePath,
        caption: this.resolveCaption(metadata),
        tempDir,
      };
    } catch (error) {
      throw this.toSocialDownloadError(error);
    }
  }

  async cleanup(tempDir: string): Promise<void> {
    await rm(tempDir, { force: true, recursive: true });
  }

  private async fetchMetadata(
    request: SocialDownloadRequest,
  ): Promise<YtDlpMetadata> {
    const { stdout } = await this.execYtDlp(
      'yt-dlp',
      ['--dump-single-json', '--no-playlist', request.url],
      { timeout: request.timeoutMs, maxBuffer: 10 * 1024 * 1024 },
    );

    return JSON.parse(stdout) as YtDlpMetadata;
  }

  private async downloadMedia(
    request: SocialDownloadRequest,
    tempDir: string,
  ): Promise<void> {
    await this.execYtDlp(
      'yt-dlp',
      [
        '--no-playlist',
        '--max-filesize',
        `${request.maxFileMb}M`,
        '--paths',
        tempDir,
        '--output',
        '%(title).80s.%(ext)s',
        '--format',
        'best',
        request.url,
      ],
      { timeout: request.timeoutMs, maxBuffer: 10 * 1024 * 1024 },
    );
  }

  private execYtDlp(
    file: string,
    args: string[],
    options: { timeout: number; maxBuffer: number },
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      execFile(file, args, options, (error, stdout, stderr) => {
        if (error) {
          reject(Object.assign(error, { stderr }));
          return;
        }

        resolve({ stdout, stderr });
      });
    });
  }

  private async resolveDownloadedFile(tempDir: string): Promise<string> {
    const entries = await readdir(tempDir);
    const mediaFile = entries.find((entry) => !entry.endsWith('.json'));

    if (!mediaFile) {
      throw new SocialDownloadError('download-failed', 'No downloaded file found');
    }

    const filePath = join(tempDir, mediaFile);
    await access(filePath, constants.R_OK);

    return filePath;
  }

  private resolveCaption(metadata: YtDlpMetadata): string {
    const caption = metadata.description?.trim() || metadata.title?.trim();
    return caption ? caption.slice(0, 1000) : '*[ℹ️]* Sin descripcion.';
  }

  private toSocialDownloadError(error: unknown): SocialDownloadError {
    if (error instanceof SocialDownloadError) {
      return error;
    }

    const nodeError = error as NodeJS.ErrnoException & { killed?: boolean };
    const message = `${nodeError.message ?? ''}\n${String(
      (nodeError as { stderr?: string }).stderr ?? '',
    )}`;
    const normalizedMessage = message.toLowerCase();

    if (nodeError.code === 'ENOENT') {
      return new SocialDownloadError('missing-binary', message);
    }

    if (nodeError.killed || normalizedMessage.includes('timeout')) {
      return new SocialDownloadError('timeout', message);
    }

    if (
      normalizedMessage.includes('private') ||
      normalizedMessage.includes('login') ||
      normalizedMessage.includes('sign in')
    ) {
      return new SocialDownloadError('private-content', message);
    }

    if (
      normalizedMessage.includes('max-filesize') ||
      normalizedMessage.includes('larger than')
    ) {
      return new SocialDownloadError('max-size', message);
    }

    return new SocialDownloadError('download-failed', message);
  }
}
