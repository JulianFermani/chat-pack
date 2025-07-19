import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, Message, RemoteAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { CommandHandlerService } from './command-handler.service';
import { ConfigService } from '@nestjs/config';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import type { Store } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name, {
    timestamp: true,
  });
  private client: Client;

  constructor(
    private readonly commandHandler: CommandHandlerService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGODB_URI')!;
    await mongoose.connect(mongoUri);

    const store = new MongoStore({ mongoose }) as unknown as Store;

    this.client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        clientId: 'cliente',
        backupSyncIntervalMs: 60000,
      }),
      puppeteer: {
        executablePath: this.configService.get<string>('chromium_dir'),
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

    this.client.on('remote_session_saved', () => {
      this.logger.log('Sesión remota guardada en MongoDB.');
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
