import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

import { DATABASE_CONNECTION } from './database.constants';

const getRequiredMongoUri = (configService: ConfigService): string => {
  const mongoUri = configService.get<string>('MONGODB_URI')?.trim();

  if (!mongoUri) {
    throw new Error('Falta la variable de entorno requerida: MONGODB_URI');
  }

  return mongoUri;
};

const ensureDatabaseConnection = async (
  configService: ConfigService,
): Promise<Connection> => {
  const connection = mongoose.connection;

  if (connection.readyState === mongoose.STATES.connected) {
    return connection;
  }

  if (connection.readyState === mongoose.STATES.connecting) {
    await connection.asPromise();
    return connection;
  }

  await mongoose.connect(getRequiredMongoUri(configService));

  return mongoose.connection;
};

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    ensureDatabaseConnection(configService),
};
