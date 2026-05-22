export type SocialDownloadErrorCode =
  | 'missing-binary'
  | 'private-content'
  | 'max-size'
  | 'timeout'
  | 'download-failed';

export class SocialDownloadError extends Error {
  constructor(
    readonly code: SocialDownloadErrorCode,
    message: string,
  ) {
    super(message);
    this.name = SocialDownloadError.name;
  }
}

export function buildSocialDownloadErrorMessage(
  error: unknown,
  maxFileMb: number,
): string {
  if (error instanceof SocialDownloadError) {
    switch (error.code) {
      case 'missing-binary':
        return '*[❎]* No puedo descargar contenido ahora. Falta configurar yt-dlp.';
      case 'private-content':
        return '*[🔒]* No pude descargarlo. Puede ser privado o requerir login.';
      case 'max-size':
        return `*[📦]* El archivo supera el limite de ${maxFileMb} MB.`;
      case 'timeout':
        return '*[⏱️]* La descarga tardo demasiado.';
      case 'download-failed':
        return '*[❎]* No pude descargar ese contenido ahora.';
    }
  }

  return '*[❎]* No pude descargar ese contenido ahora.';
}
