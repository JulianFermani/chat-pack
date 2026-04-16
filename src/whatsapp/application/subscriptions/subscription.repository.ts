import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { SUBSCRIPTION_MODEL } from './subscription.constants';
import {
  SubscriptionChatType,
  SubscriptionRecord,
} from './subscription.schema';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @Inject(SUBSCRIPTION_MODEL)
    private readonly subscriptionModel: Model<SubscriptionRecord>,
  ) {}

  async findByChatAndTopic(chatId: string, topic: string) {
    return this.subscriptionModel.findOne({ chatId, topic }).lean();
  }

  async activate(
    chatId: string,
    topic: string,
    chatType: SubscriptionChatType,
  ): Promise<void> {
    await this.subscriptionModel.updateOne(
      { chatId, topic },
      {
        $set: {
          active: true,
          chatType,
        },
        $setOnInsert: {
          chatId,
          topic,
        },
      },
      { upsert: true },
    );
  }

  async deactivate(chatId: string, topic: string): Promise<boolean> {
    const result = await this.subscriptionModel.updateOne(
      { chatId, topic, active: true },
      {
        $set: {
          active: false,
        },
      },
    );

    return result.modifiedCount > 0;
  }

  async findActiveByTopic(topic: string) {
    return this.subscriptionModel.find({ topic, active: true }).lean();
  }
}
