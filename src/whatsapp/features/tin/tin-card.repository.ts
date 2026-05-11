import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { TIN_CARD_MODEL } from './tin.constants';
import { TinCardRecord } from './tin-card.schema';

@Injectable()
export class TinCardRepository {
  constructor(
    @Inject(TIN_CARD_MODEL)
    private readonly tinCardModel: Model<TinCardRecord>,
  ) {}

  async findByChatId(chatId: string) {
    return this.tinCardModel.findOne({ chatId }).lean();
  }

  async upsert(chatId: string, tin: string): Promise<void> {
    await this.tinCardModel.updateOne(
      { chatId },
      {
        $set: {
          tin,
        },
        $setOnInsert: {
          chatId,
        },
      },
      { upsert: true },
    );
  }

  async deleteByChatId(chatId: string): Promise<boolean> {
    const result = await this.tinCardModel.deleteOne({ chatId });

    return result.deletedCount > 0;
  }
}
