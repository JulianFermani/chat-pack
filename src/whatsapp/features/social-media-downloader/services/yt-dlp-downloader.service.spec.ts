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

import { YtDlpDownloaderService } from './yt-dlp-downloader.service';

jest.mock('node:child_process', () => ({
  execFile: jest.fn(),
}));

jest.mock('node:fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  mkdtemp: jest.fn(),
  readFile: jest.fn(),
  readdir: jest.fn(),
  rm: jest.fn(),
}));

describe('YtDlpDownloaderService', () => {
  type ExecFileCallback = (
    error: NodeJS.ErrnoException | null,
    stdout: string,
    stderr: string,
  ) => void;

  type ExecFileMock = (
    file: string,
    args: readonly string[] | null | undefined,
    options: object | null | undefined,
    callback?: ExecFileCallback,
  ) => ReturnType<typeof execFile>;

  const mockedExecFile = jest.mocked(execFile);
  const mockedAccess = jest.mocked(access);
  const mockedMkdir = jest.mocked(mkdir);
  const mockedMkdtemp = jest.mocked(mkdtemp);
  const mockedReadFile = jest.mocked(readFile);
  const mockedReaddir = jest.mocked(readdir);
  const mockedRm = jest.mocked(rm);
  let service: YtDlpDownloaderService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAccess.mockResolvedValue(undefined);
    mockedMkdir.mockResolvedValue(undefined);
    mockedMkdtemp.mockResolvedValue('/tmp/social/download-abc');
    mockedReadFile.mockResolvedValue(
      JSON.stringify({ description: 'caption del post', title: 'titulo' }),
    );
    mockReaddir(['video.mp4', 'video.info.json']);
    service = new YtDlpDownloaderService();
  });

  function mockExecSuccess(stdoutByCall: string[]) {
    const implementation: ExecFileMock = (_file, _args, _options, callback) => {
      const stdout = stdoutByCall.shift() ?? '';
      callback?.(null, stdout, '');
      return undefined as unknown as ReturnType<typeof execFile>;
    };

    mockedExecFile.mockImplementation(implementation);
  }

  function mockExecFailure(error: NodeJS.ErrnoException, stderr: string) {
    const implementation: ExecFileMock = (_file, _args, _options, callback) => {
      callback?.(error, '', stderr);
      return undefined as unknown as ReturnType<typeof execFile>;
    };

    mockedExecFile.mockImplementation(implementation);
  }

  function mockReaddir(entries: string[]) {
    mockedReaddir.mockResolvedValue(
      entries as unknown as Awaited<ReturnType<typeof readdir>>,
    );
  }

  it('downloads a url and returns downloaded file, caption and temp directory', async () => {
    mockExecSuccess(['']);

    const result = await service.download({
      url: 'https://x.com/user/status/123',
      ytDlpPath: '/usr/local/bin/yt-dlp',
      baseTempDir: '/tmp/social',
      maxFileMb: 100,
      timeoutMs: 120_000,
    });

    expect(mockedMkdir).toHaveBeenCalledWith('/tmp/social', {
      recursive: true,
    });
    expect(mockedMkdtemp).toHaveBeenCalledWith('/tmp/social/download-');
    expect(mockedExecFile).toHaveBeenCalledTimes(1);
    expect(mockedExecFile).toHaveBeenCalledWith(
      '/usr/local/bin/yt-dlp',
      expect.arrayContaining([
        '--no-cache-dir',
        '--write-info-json',
        '--no-playlist',
        '--max-filesize',
        '100M',
      ]),
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
    mockExecSuccess(['']);
    mockedReadFile.mockResolvedValue(
      JSON.stringify({ title: 'titulo del post' }),
    );

    await expect(
      service.download({
        url: 'https://www.instagram.com/p/abc/',
        ytDlpPath: 'yt-dlp',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).resolves.toMatchObject({ caption: 'titulo del post' });
  });

  it('falls back to an empty caption when metadata file is missing', async () => {
    mockExecSuccess(['']);
    mockReaddir(['video.mp4']);

    await expect(
      service.download({
        url: 'https://www.tiktok.com/@u/video/1',
        ytDlpPath: 'yt-dlp',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).resolves.toMatchObject({ caption: '*[ℹ️]* Sin descripcion.' });
  });

  it('maps missing binary errors', async () => {
    mockExecFailure(
      Object.assign(new Error('spawn ENOENT'), { code: 'ENOENT' }),
      '',
    );

    await expect(
      service.download({
        url: 'https://x.com/user/status/123',
        ytDlpPath: 'yt-dlp',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).rejects.toHaveProperty('code', 'missing-binary');
  });

  it('maps private or login required stderr', async () => {
    mockExecFailure(
      new Error('failed'),
      'This video is private, login required',
    );

    await expect(
      service.download({
        url: 'https://www.instagram.com/reel/abc/',
        ytDlpPath: 'yt-dlp',
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
        ytDlpPath: 'yt-dlp',
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
        ytDlpPath: 'yt-dlp',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 1,
      }),
    ).rejects.toHaveProperty('code', 'timeout');
  });

  it('maps rate limit errors', async () => {
    mockExecFailure(
      new Error('failed'),
      'Unable to download webpage: HTTP Error 429: Too Many Requests',
    );

    await expect(
      service.download({
        url: 'https://www.tiktok.com/@u/video/1',
        ytDlpPath: 'yt-dlp',
        baseTempDir: '/tmp/social',
        maxFileMb: 100,
        timeoutMs: 120_000,
      }),
    ).rejects.toHaveProperty('code', 'rate-limited');
  });

  it('removes a temp directory during cleanup', async () => {
    await service.cleanup('/tmp/social/download-abc');

    expect(mockedRm).toHaveBeenCalledWith('/tmp/social/download-abc', {
      force: true,
      recursive: true,
    });
  });

  it('checks that the downloaded file exists before returning it', async () => {
    mockExecSuccess(['']);

    await service.download({
      url: 'https://x.com/user/status/123',
      ytDlpPath: 'yt-dlp',
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
