import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
} from 'node:fs/promises';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';

import { SocialDownloadError } from '../social-download/social-download-errors';

export interface SocialDownloadRequest {
  url: string;
  ytDlpPath: string;
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
  async download(
    request: SocialDownloadRequest,
  ): Promise<SocialDownloadResult> {
    await mkdir(request.baseTempDir, { recursive: true });
    const tempDir = await mkdtemp(join(request.baseTempDir, 'download-'));

    try {
      await this.downloadMedia(request, tempDir);
      const filePath = await this.resolveDownloadedFile(tempDir);
      const metadata = await this.resolveDownloadedMetadata(tempDir);

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

  private async downloadMedia(
    request: SocialDownloadRequest,
    tempDir: string,
  ): Promise<void> {
    await this.execYtDlp(
      request.ytDlpPath,
      [
        '--no-cache-dir',
        '--no-playlist',
        '--write-info-json',
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
          const errorWithStderr: Error & { stderr: string | Buffer } =
            Object.assign(error, { stderr });
          reject(errorWithStderr);
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
      throw new SocialDownloadError(
        'download-failed',
        'No downloaded file found',
      );
    }

    const filePath = join(tempDir, mediaFile);
    await access(filePath, constants.R_OK);

    return filePath;
  }

  private async resolveDownloadedMetadata(
    tempDir: string,
  ): Promise<YtDlpMetadata> {
    const entries = await readdir(tempDir);
    const metadataFile = entries.find((entry) => entry.endsWith('.info.json'));

    if (!metadataFile) {
      return {};
    }

    try {
      const content = await readFile(join(tempDir, metadataFile), 'utf8');
      return JSON.parse(content) as YtDlpMetadata;
    } catch {
      return {};
    }
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
      normalizedMessage.includes('http error 429') ||
      normalizedMessage.includes('too many requests')
    ) {
      return new SocialDownloadError('rate-limited', message);
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
