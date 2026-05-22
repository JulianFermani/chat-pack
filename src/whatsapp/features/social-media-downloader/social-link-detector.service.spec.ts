import { SocialLinkDetectorService } from './social-link-detector.service';

describe('SocialLinkDetectorService', () => {
  let service: SocialLinkDetectorService;

  beforeEach(() => {
    service = new SocialLinkDetectorService();
  });

  it.each([
    ['https://www.instagram.com/reel/abc123/'],
    ['https://vm.tiktok.com/ZMabc123/'],
    ['https://www.tiktok.com/@user/video/123'],
    ['https://twitter.com/user/status/123'],
    ['https://x.com/user/status/123'],
    ['https://mobile.twitter.com/user/status/123'],
  ])('extracts supported social url %s', (url) => {
    expect(service.extractFirstSupportedUrl(`mira esto ${url}`)).toBe(url);
  });

  it('returns the first supported url when message contains many urls', () => {
    expect(
      service.extractFirstSupportedUrl(
        'https://example.com https://x.com/user/status/123 https://www.instagram.com/p/abc/',
      ),
    ).toBe('https://x.com/user/status/123');
  });

  it('ignores unsupported urls and plain text', () => {
    expect(
      service.extractFirstSupportedUrl('texto https://example.com/post/1'),
    ).toBeUndefined();
    expect(service.extractFirstSupportedUrl('sin links')).toBeUndefined();
  });

  it('removes trailing punctuation from supported urls', () => {
    expect(
      service.extractFirstSupportedUrl('mira https://www.instagram.com/p/abc/.'),
    ).toBe('https://www.instagram.com/p/abc/');
  });
});
