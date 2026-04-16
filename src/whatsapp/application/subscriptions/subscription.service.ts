import { Injectable } from '@nestjs/common';

import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionChatType } from './subscription.schema';

export type SubscribeResult = 'created' | 'reactivated' | 'already-active';

export type UnsubscribeResult = 'deactivated' | 'not-active';

@Injectable()
export class SubscriptionService {
  constructor(private readonly repository: SubscriptionRepository) {}

  async subscribe(
    chatId: string,
    topic: string,
    chatType: SubscriptionChatType,
  ): Promise<SubscribeResult> {
    const existingSubscription = await this.repository.findByChatAndTopic(
      chatId,
      topic,
    );

    await this.repository.activate(chatId, topic, chatType);

    if (!existingSubscription) {
      return 'created';
    }

    if (existingSubscription.active) {
      return 'already-active';
    }

    return 'reactivated';
  }

  async unsubscribe(chatId: string, topic: string): Promise<UnsubscribeResult> {
    const wasDeactivated = await this.repository.deactivate(chatId, topic);

    return wasDeactivated ? 'deactivated' : 'not-active';
  }

  async findActiveByTopic(topic: string) {
    return this.repository.findActiveByTopic(topic);
  }
}
