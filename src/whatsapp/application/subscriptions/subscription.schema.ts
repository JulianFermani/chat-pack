import { Connection, Model, Schema } from 'mongoose';

export type SubscriptionChatType = 'private' | 'group';

export interface SubscriptionRecord {
  chatId: string;
  topic: string;
  chatType: SubscriptionChatType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionRecord>(
  {
    chatId: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    chatType: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: 'subscriptions',
    timestamps: true,
  },
);

subscriptionSchema.index({ chatId: 1, topic: 1 }, { unique: true });

export const getSubscriptionModel = (
  connection: Connection,
): Model<SubscriptionRecord> => {
  return (
    (connection.models.Subscription as Model<SubscriptionRecord> | undefined) ??
    connection.model<SubscriptionRecord>('Subscription', subscriptionSchema)
  );
};
