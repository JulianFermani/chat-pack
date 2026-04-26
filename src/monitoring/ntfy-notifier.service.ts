import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NtfyNotifierService {
  private readonly logger = new Logger(NtfyNotifierService.name);
  private readonly baseUrl: string;
  private readonly topic?: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('NTFY_BASE_URL')?.trim() ||
      'https://ntfy.sh';
    this.topic = this.configService.get<string>('NTFY_TOPIC')?.trim();

    if (!this.isConfigured()) {
      this.logger.warn(
        'Notificaciones de ntfy deshabilitadas: falta NTFY_TOPIC.',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(this.topic);
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.topic) {
      return;
    }

    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(this.topic)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: message,
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `ntfy respondio con ${response.status}: ${body || 'sin detalle'}`,
      );
    }
  }
}
