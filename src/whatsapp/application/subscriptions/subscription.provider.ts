import { Connection } from 'mongoose';

import { DATABASE_CONNECTION } from '@database/database.constants';

import { SUBSCRIPTION_MODEL } from './subscription.constants';
import { getSubscriptionModel } from './subscription.schema';

export const subscriptionModelProvider = {
  provide: SUBSCRIPTION_MODEL,
  inject: [DATABASE_CONNECTION],
  useFactory: (connection: Connection) => getSubscriptionModel(connection),
};
