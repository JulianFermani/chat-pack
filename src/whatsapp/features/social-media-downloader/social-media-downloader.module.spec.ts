import { ConfigModule } from '@nestjs/config';

import { SocialMediaDownloaderModule } from './social-media-downloader.module';

describe('SocialMediaDownloaderModule', () => {
  it('imports ConfigModule for SocialDownloadPolicyService dependencies', () => {
    const imports = Reflect.getMetadata('imports', SocialMediaDownloaderModule);

    expect(imports).toContain(ConfigModule);
  });
});
