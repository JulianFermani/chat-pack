import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocialDownloadPolicyService {
  private static readonly defaultMaxFileMb = 100;
  private static readonly defaultTimeoutMs = 120_000;
  private static readonly defaultTempDir = '/tmp/chat-pack-social-downloads';

  constructor(private readonly configService: ConfigService) {}

  shouldHandle(isGroup: boolean): boolean {
    if (!this.getBoolean('SOCIAL_DOWNLOAD_ENABLED', true)) {
      return false;
    }

    if (isGroup) {
      return this.getBoolean('SOCIAL_DOWNLOAD_GROUPS_ENABLED', false);
    }

    return true;
  }

  getMaxFileMb(): number {
    return this.getPositiveNumber(
      'SOCIAL_DOWNLOAD_MAX_FILE_MB',
      SocialDownloadPolicyService.defaultMaxFileMb,
    );
  }

  getTimeoutMs(): number {
    return this.getPositiveNumber(
      'SOCIAL_DOWNLOAD_TIMEOUT_MS',
      SocialDownloadPolicyService.defaultTimeoutMs,
    );
  }

  getTempDir(): string {
    return (
      this.configService.get<string>('SOCIAL_DOWNLOAD_TMP_DIR')?.trim() ||
      SocialDownloadPolicyService.defaultTempDir
    );
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string>(key)?.trim().toLowerCase();

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return defaultValue;
  }

  private getPositiveNumber(key: string, defaultValue: number): number {
    const rawValue = this.configService.get<string>(key);
    const value = rawValue ? Number(rawValue) : undefined;

    return value && Number.isFinite(value) && value > 0 ? value : defaultValue;
  }
}
