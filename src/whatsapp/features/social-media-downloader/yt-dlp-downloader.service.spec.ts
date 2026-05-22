import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';

import { SocialDownloadError } from './social-download-errors';
import { YtDlpDownloaderService } from './yt-dlp-downloader.service';

jest.mock('node:child_process', () => ({
  execFile: jest.fn(),
}));

jest.mock('node:fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  mkdtemp: jest.fn(),
  readdir: jest.fn(),
  rm: jest.fn(),
}));

describe('YtDlpDownloaderService', () => {
  const mockedExecFile = jest.mocked(execFile);
  const mockedAccess = jest.mocked(access);
  const mockedMkdir = jest.mocked(mkdir);
  const mockedMkdtemp = jest.mocked(mkdtemp);
  const mockedReaddir = jest.mocked(readdir);
  const mockedRm = jest.mocked(rm);
  let service: YtDlpDownloaderService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAccess.mockResolvedValue(undefined);
    mockedMkdir.mockResolvedValue(undefined as any);
    mockedMkdtemp.mockResolvedValue('/tmp/social/download-abc');
    mockedReaddir.mockResolvedValue(['video.mp4', 'video.info.json'] as any);
    service = new YtDlpDownloaderService();
  });

  function mockExecSuccess(stdoutByCall: string[]) {
    mockedExecFile.mockImplementation(((_file, _args, _options, callback) => {
      const stdout = stdoutByCall.shift() ?? '';
      callback?.(null, stdout, '');
      return {} as any;
    }) as any);
  }

  function mockExecFailure(error: NodeJS.ErrnoException, stderr: string) {
    mockedExecFile.mockImplementation(((_file, _args, _options, callback) => {
      callback?.(error, '', stderr);
      return {} as any;
    }) as any);
  }

  it('downloads a url and returns downloaded file, caption and temp directory', async () => {
    mockExecSuccess([
      JSON.stringify({ description: 'caption del post', title: 'titulo' }),
      '',
    ]);

    const result = await service.download({
      url: 'https://x.com/user/status/123',
      baseTempDir: '/tmp/social',
      maxFileMb: 100,
      timeoutMs: 120_000,
    });

    expect(mockedMkdir).toHaveBeenCalledWith('/tmp/social', {
      recursive: true,
    });
    expect(mockedMkdtemp).toHaveBeenCalledWith('/tmp/social/download-');
    expect(mockedExecFile).toHaveBeenCalledWith(
      'yt-dlp',
      expect.arrayContaining(['--dump-single-json']),
      expect.objectContaining({ timeout: 120_000 }),
      expect.any(Function),
    );
    expect(mockedExecFile).toHaveBeenCalledWith(
      'yt-dlp',
      expect.arrayContaining(['--max-filesize', '100M']),
      expect.objectContaining({ timeout: 120_000 }),
      expect.any(Function),
    );
    expect(result).toEqual({
      filePath: '/tmp/social/download-abc/video.mp4',
      caption: 'caption del post',
      tempDir: '/tmp/social/download-abc',
    });
  });

  it('falls back to title when description is missing', async () => {
    mockExecSuccess([JSON.stringify({ title: 'titulo del post' }), '']);

    await expect(
      service.download({
        url: 'https://www.instagram.com/p/abc/',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).resolves.toMatchObject({ caption: 'titulo del post' });
  });

  it('maps missing binary errors', async () => {
    mockExecFailure(Object.assign(new Error('spawn ENOENT'), { code: 'ENOENT' }), '');

    await expect(
      service.download({
        url: 'https://x.com/user/status/123',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).rejects.toHaveProperty('code', 'missing-binary');
  });

  it('maps private or login required stderr', async () => {
    mockExecFailure(new Error('failed'), 'This video is private, login required');

    await expect(
      service.download({
        url: 'https://www.instagram.com/reel/abc/',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).rejects.toHaveProperty('code', 'private-content');
  });

  it('maps max size stderr', async () => {
    mockExecFailure(new Error('failed'), 'File is larger than max-filesize');

    await expect(
      service.download({
        url: 'https://www.tiktok.com/@u/video/1',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).rejects.toHaveProperty('code', 'max-size');
  });

  it('maps timeout errors', async () => {
    mockExecFailure(Object.assign(new Error('timeout'), { killed: true }), '');

    await expect(
      service.download({
        url: 'https://x.com/user/status/123',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 1,
      }),
    ).rejects.toHaveProperty('code', 'timeout');
  });

  it('removes a temp directory during cleanup', async () => {
    await service.cleanup('/tmp/social/download-abc');

    expect(mockedRm).toHaveBeenCalledWith('/tmp/social/download-abc', {
      force: true,
      recursive: true,
    });
  });

  it('checks that the downloaded file exists before returning it', async () => {
    mockExecSuccess([JSON.stringify({ description: 'caption' }), '']);

    await service.download({
      url: 'https://x.com/user/status/123',
      baseTempDir: '/tmp/social',
      maxFileMb: 100,
      timeoutMs: 120_000,
    });

    expect(mockedAccess).toHaveBeenCalledWith(
      '/tmp/social/download-abc/video.mp4',
      constants.R_OK,
    );
  });
});
