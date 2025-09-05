import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
export const WHATSAPP_CLIENT = 'WHATSAPP_CLIENT';
export const whatsappClientProvider = {
  provide: WHATSAPP_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const mongoUri = configService.get<string>('MONGODB_URI')!;
    await mongoose.connect(mongoUri);
    const store = new MongoStore({ mongoose });
    const client = new Client({
      authStrategy: new RemoteAuth({
        store,
        clientId: 'cliente',
        backupSyncIntervalMs: 60000,
      }),
      puppeteer: {
        executablePath: configService.get<string>('CHROMIUM_DIR'),
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
      webVersionCache: { type: 'none' },
    });
    return client;
  },
};
