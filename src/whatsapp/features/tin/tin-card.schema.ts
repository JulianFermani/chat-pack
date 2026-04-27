import { Connection, Model, Schema } from 'mongoose';

export interface TinCardRecord {
  chatId: string;
  tin: string;
  createdAt: Date;
  updatedAt: Date;
}

const tinCardSchema = new Schema<TinCardRecord>(
  {
    chatId: {
      type: String,
      required: true,
      trim: true,
    },
    tin: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    collection: 'tin_cards',
    timestamps: true,
  },
);

tinCardSchema.index({ chatId: 1 }, { unique: true });

export const getTinCardModel = (
  connection: Connection,
): Model<TinCardRecord> => {
  return (
    (connection.models.TinCard as Model<TinCardRecord> | undefined) ??
    connection.model<TinCardRecord>('TinCard', tinCardSchema)
  );
};
