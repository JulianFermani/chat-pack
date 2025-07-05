import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { CommandHandlerService } from './command-handler.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name, {
    timestamp: true,
  });
  private client: Client;

  constructor(private readonly commandHandler: CommandHandlerService) {}

  onModuleInit() {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'cliente' }),
      puppeteer: {
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
      ffmpegPath: '/usr/bin/ffmpeg',
      webVersionCache: {
        type: 'none',
      },
    });

    this.client.on('qr', (qr: string) => {
      this.logger.log(`Escaneá el QR: `);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('El cliente está listo para recibir mensajes!!');
    });

    this.client.on('message', (message: Message) => {
      (async () => {
        await this.commandHandler.handle(message, this.client);
        this.logger.log(`Mensaje recibido: ${message.body}`);
      })().catch(console.error);
    });

    void this.client.initialize();
  }
}
