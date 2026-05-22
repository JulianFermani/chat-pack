import { ConfigService } from '@nestjs/config';

import { SocialDownloadPolicyService } from './social-download-policy.service';

describe('SocialDownloadPolicyService', () => {
  function createService(values: Record<string, string | undefined> = {}) {
    const configService = {
      get: jest.fn((key: string) => values[key]),
    } as unknown as ConfigService;

    return new SocialDownloadPolicyService(configService);
  }

  it('enables private chats by default and disables groups by default', () => {
    const service = createService();

    expect(service.shouldHandle(false)).toBe(true);
    expect(service.shouldHandle(true)).toBe(false);
  });

  it('disables the feature when SOCIAL_DOWNLOAD_ENABLED is false', () => {
    const service = createService({ SOCIAL_DOWNLOAD_ENABLED: 'false' });

    expect(service.shouldHandle(false)).toBe(false);
    expect(service.shouldHandle(true)).toBe(false);
  });

  it('enables group chats when SOCIAL_DOWNLOAD_GROUPS_ENABLED is true', () => {
    const service = createService({ SOCIAL_DOWNLOAD_GROUPS_ENABLED: 'true' });

    expect(service.shouldHandle(true)).toBe(true);
  });

  it('uses default download limits when env values are missing', () => {
    const service = createService();

    expect(service.getMaxFileMb()).toBe(100);
    expect(service.getTimeoutMs()).toBe(120_000);
    expect(service.getTempDir()).toBe('/tmp/chat-pack-social-downloads');
  });

  it('uses configured download limits when env values are valid', () => {
    const service = createService({
      SOCIAL_DOWNLOAD_MAX_FILE_MB: '75',
      SOCIAL_DOWNLOAD_TIMEOUT_MS: '30000',
      SOCIAL_DOWNLOAD_TMP_DIR: '/tmp/custom-social',
    });

    expect(service.getMaxFileMb()).toBe(75);
    expect(service.getTimeoutMs()).toBe(30_000);
    expect(service.getTempDir()).toBe('/tmp/custom-social');
  });

  it('falls back to defaults when numeric env values are invalid', () => {
    const service = createService({
      SOCIAL_DOWNLOAD_MAX_FILE_MB: 'nope',
      SOCIAL_DOWNLOAD_TIMEOUT_MS: '0',
    });

    expect(service.getMaxFileMb()).toBe(100);
    expect(service.getTimeoutMs()).toBe(120_000);
  });
});
