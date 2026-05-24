import {
  SocialDownloadError,
  buildSocialDownloadErrorMessage,
} from './social-download-errors';

describe('buildSocialDownloadErrorMessage', () => {
  it.each([
    [
      new SocialDownloadError('missing-binary', 'yt-dlp missing'),
      '*[❎]* No puedo descargar contenido ahora. Falta configurar yt-dlp.',
    ],
    [
      new SocialDownloadError('private-content', 'login required'),
      '*[🔒]* No pude descargarlo. Puede ser privado o requerir login.',
    ],
    [
      new SocialDownloadError('max-size', 'too big'),
      '*[📦]* El archivo supera el limite de 100 MB.',
    ],
    [
      new SocialDownloadError('timeout', 'too slow'),
      '*[⏱️]* La descarga tardo demasiado.',
    ],
    [
      new SocialDownloadError('rate-limited', 'HTTP Error 429'),
      '*[🚦]* TikTok limito las descargas por ahora. Proba de nuevo en unos minutos.',
    ],
  ])('maps typed error to emoji message', (error, expectedMessage) => {
    expect(buildSocialDownloadErrorMessage(error, 100)).toBe(expectedMessage);
  });

  it('maps unknown errors to a generic emoji message', () => {
    expect(buildSocialDownloadErrorMessage(new Error('boom'), 100)).toBe(
      '*[❎]* No pude descargar ese contenido ahora.',
    );
  });
});
