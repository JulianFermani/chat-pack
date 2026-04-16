import { Client, LocalAuth, RemoteAuth, type Store } from 'whatsapp-web.js';

import { ConfigService } from '@nestjs/config';

import mongoose from 'mongoose';

import { MongoStore } from 'wwebjs-mongo';

export const WHATSAPP_CLIENT = 'WHATSAPP_CLIENT';

type WhatsappAuthMode = 'local' | 'remote';

const DEFAULT_CLIENT_ID = 'cliente';
const DEFAULT_REMOTE_BACKUP_SYNC_INTERVAL_MS = 60000;

type MongoStoreConstructor = new (options: {
  mongoose: typeof mongoose;
}) => Store;

const MongoStoreWithTypes = MongoStore as unknown as MongoStoreConstructor;

const getRequiredConfig = (
  configService: ConfigService,
  key: string,
): string => {
  const value = configService.get<string>(key)?.trim();

  if (!value) {
    throw new Error(`Falta la variable de entorno requerida: ${key}`);
  }

  return value;
};

const getWhatsappAuthMode = (
  configService: ConfigService,
): WhatsappAuthMode => {
  const authMode = configService.get<string>('WHATSAPP_AUTH_MODE')?.trim();

  if (authMode === 'local' || authMode === 'remote') {
    return authMode;
  }

  throw new Error('WHATSAPP_AUTH_MODE debe ser "local" o "remote".');
};

const getWhatsappClientId = (configService: ConfigService): string =>
  configService.get<string>('WHATSAPP_CLIENT_ID')?.trim() || DEFAULT_CLIENT_ID;

const getRemoteBackupSyncIntervalMs = (
  configService: ConfigService,
): number => {
  const configuredValue = configService
    .get<string>('WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS')
    ?.trim();

  if (!configuredValue) {
    return DEFAULT_REMOTE_BACKUP_SYNC_INTERVAL_MS;
  }

  const backupSyncIntervalMs = Number(configuredValue);

  if (!Number.isInteger(backupSyncIntervalMs) || backupSyncIntervalMs <= 0) {
    throw new Error(
      'WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS debe ser un entero positivo.',
    );
  }

  return backupSyncIntervalMs;
};

const ensureMongoConnection = async (mongoUri: string) => {
  if (mongoose.connection.readyState === mongoose.STATES.disconnected) {
    await mongoose.connect(mongoUri);
  }
};

const buildAuthStrategy = async (configService: ConfigService) => {
  const authMode = getWhatsappAuthMode(configService);
  const clientId = getWhatsappClientId(configService);

  if (authMode === 'local') {
    return new LocalAuth({
      clientId,
    });
  }

  const mongoUri = getRequiredConfig(configService, 'MONGODB_URI');
  await ensureMongoConnection(mongoUri);

  return new RemoteAuth({
    store: new MongoStoreWithTypes({ mongoose }),
    clientId,
    backupSyncIntervalMs: getRemoteBackupSyncIntervalMs(configService),
  });
};

export const whatsappClientProvider = {
  provide: WHATSAPP_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const client = new Client({
      authStrategy: await buildAuthStrategy(configService),
      puppeteer: {
        executablePath: getRequiredConfig(configService, 'CHROMIUM_DIR'),
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
    });
    return client;
  },
};
