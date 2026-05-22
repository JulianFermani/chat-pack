import { MessageMedia } from 'whatsapp-web.js';

import { SocialDownloadError } from './social-download-errors';
import { SocialDownloadHandler } from './social-download.handler';

describe('SocialDownloadHandler', () => {
  const whatsapp = {
    sendMessage: jest.fn(),
    sendMediaWithCaption: jest.fn(),
  };
  const detector = {
    extractFirstSupportedUrl: jest.fn(),
  };
  const policy = {
    shouldHandle: jest.fn(),
    getMaxFileMb: jest.fn(),
    getTimeoutMs: jest.fn(),
    getTempDir: jest.fn(),
  };
  const downloader = {
    download: jest.fn(),
    cleanup: jest.fn(),
  };
  let handler: SocialDownloadHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    policy.shouldHandle.mockReturnValue(true);
    policy.getMaxFileMb.mockReturnValue(100);
    policy.getTimeoutMs.mockReturnValue(120_000);
    policy.getTempDir.mockReturnValue('/tmp/social');
    handler = new SocialDownloadHandler(
      whatsapp as any,
      detector as any,
      policy as any,
      downloader as any,
    );
    jest
      .spyOn(MessageMedia, 'fromFilePath')
      .mockReturnValue(new MessageMedia('video/mp4', 'ZmFrZQ==', 'video.mp4'));
  });

  it('downloads a detected url, sends media with caption, and cleans temp files', async () => {
    detector.extractFirstSupportedUrl.mockReturnValue('https://x.com/u/status/1');
    downloader.download.mockResolvedValue({
      filePath: '/tmp/social/download-abc/video.mp4',
      caption: 'caption del post',
      tempDir: '/tmp/social/download-abc',
    });

    await handler.handle({
      from: 'user@c.us',
      body: 'mira https://x.com/u/status/1',
    } as any);

    expect(whatsapp.sendMessage).toHaveBeenCalledWith(
      'user@c.us',
      '*[⏳]* Descargando el contenido...',
    );
    expect(downloader.download).toHaveBeenCalledWith({
      url: 'https://x.com/u/status/1',
      baseTempDir: '/tmp/social',
      maxFileMb: 100,
      timeoutMs: 120_000,
    });
    expect(whatsapp.sendMediaWithCaption).toHaveBeenCalledWith(
      'user@c.us',
      expect.any(MessageMedia),
      'caption del post',
    );
    expect(downloader.cleanup).toHaveBeenCalledWith('/tmp/social/download-abc');
  });

  it('does nothing when message has no supported url', async () => {
    detector.extractFirstSupportedUrl.mockReturnValue(undefined);

    await handler.handle({ from: 'user@c.us', body: 'hola' } as any);

    expect(whatsapp.sendMessage).not.toHaveBeenCalled();
    expect(downloader.download).not.toHaveBeenCalled();
  });

  it('does nothing when policy disables the chat type', async () => {
    detector.extractFirstSupportedUrl.mockReturnValue('https://x.com/u/status/1');
    policy.shouldHandle.mockReturnValue(false);

    await handler.handle({
      from: 'group@g.us',
      body: 'https://x.com/u/status/1',
    } as any);

    expect(downloader.download).not.toHaveBeenCalled();
  });

  it('replies with emoji error message when download fails', async () => {
    detector.extractFirstSupportedUrl.mockReturnValue('https://x.com/u/status/1');
    downloader.download.mockRejectedValue(
      new SocialDownloadError('private-content', 'login'),
    );

    await handler.handle({
      from: 'user@c.us',
      body: 'https://x.com/u/status/1',
    } as any);

    expect(whatsapp.sendMessage).toHaveBeenLastCalledWith(
      'user@c.us',
      '*[🔒]* No pude descargarlo. Puede ser privado o requerir login.',
    );
  });

  it('cleans temp files when sending media fails after download', async () => {
    detector.extractFirstSupportedUrl.mockReturnValue('https://x.com/u/status/1');
    downloader.download.mockResolvedValue({
      filePath: '/tmp/social/download-abc/video.mp4',
      caption: 'caption del post',
      tempDir: '/tmp/social/download-abc',
    });
    whatsapp.sendMediaWithCaption.mockRejectedValue(new Error('send failed'));

    await handler.handle({
      from: 'user@c.us',
      body: 'https://x.com/u/status/1',
    } as any);

    expect(downloader.cleanup).toHaveBeenCalledWith('/tmp/social/download-abc');
    expect(whatsapp.sendMessage).toHaveBeenLastCalledWith(
      'user@c.us',
      '*[❎]* No pude descargar ese contenido ahora.',
    );
  });
});
