import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramNotifierService {
  private readonly logger = new Logger(TelegramNotifierService.name);
  private readonly botToken?: string;
  private readonly chatId?: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService
      .get<string>('TELEGRAM_BOT_TOKEN')
      ?.trim();
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID')?.trim();

    if (!this.isConfigured()) {
      this.logger.warn(
        'Notificaciones de Telegram deshabilitadas: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID.',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.botToken || !this.chatId) {
      return;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${this.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `Telegram respondio con ${response.status}: ${body || 'sin detalle'}`,
      );
    }
  }
}
