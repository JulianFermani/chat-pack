import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialLinkDetectorService {
  private readonly supportedHosts = new Set([
    'instagram.com',
    'www.instagram.com',
    'tiktok.com',
    'www.tiktok.com',
    'vm.tiktok.com',
    'twitter.com',
    'www.twitter.com',
    'mobile.twitter.com',
    'x.com',
    'www.x.com',
  ]);

  extractFirstSupportedUrl(text: string): string | undefined {
    const urls = text.match(/https?:\/\/\S+/gi) ?? [];

    for (const rawUrl of urls) {
      const url = this.trimTrailingPunctuation(rawUrl);

      if (this.isSupportedUrl(url)) {
        return url;
      }
    }

    return;
  }

  private isSupportedUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return this.supportedHosts.has(url.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  private trimTrailingPunctuation(value: string): string {
    return value.replace(/[),.;!?]+$/g, '');
  }
}
