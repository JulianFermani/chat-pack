import { Connection } from 'mongoose';

import { DATABASE_CONNECTION } from '@database/database.constants';

import { TIN_CARD_MODEL } from './tin.constants';
import { getTinCardModel } from './tin-card.schema';

export const tinCardModelProvider = {
  provide: TIN_CARD_MODEL,
  inject: [DATABASE_CONNECTION],
  useFactory: (connection: Connection) => getTinCardModel(connection),
};
