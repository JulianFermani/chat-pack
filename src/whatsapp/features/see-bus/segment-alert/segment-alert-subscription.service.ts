import { Injectable } from '@nestjs/common';

import { SubscriptionService } from '@application/subscriptions/subscription.service';
import { SEE_BUS_SEGMENT_ALERT_TOPIC_PREFIX } from '@application/subscriptions/subscription.constants';

export interface SegmentAlertTopicData {
  originGobId: string;
  destinationGobId: string;
  line: string;
  sense: 'I' | 'V';
}

@Injectable()
export class SegmentAlertSubscriptionService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async subscribeChat(
    chatId: string,
    data: SegmentAlertTopicData,
  ): Promise<'created' | 'reactivated' | 'already-active'> {
    const topic = this.buildTopic(data);

    return this.subscriptionService.subscribe(
      chatId,
      topic,
      this.getChatType(chatId),
    );
  }

  async unsubscribeAllChat(chatId: string): Promise<number> {
    return this.subscriptionService.unsubscribeAllByTopicPrefix(
      chatId,
      SEE_BUS_SEGMENT_ALERT_TOPIC_PREFIX,
    );
  }

  async findSubscribers() {
    return this.subscriptionService.findActiveByTopicPrefix(
      SEE_BUS_SEGMENT_ALERT_TOPIC_PREFIX,
    );
  }

  parseTopic(topic: string): SegmentAlertTopicData | undefined {
    const [prefix, line, sense, originGobId, destinationGobId] =
      topic.split(':');

    if (
      prefix !== SEE_BUS_SEGMENT_ALERT_TOPIC_PREFIX ||
      !line ||
      !sense ||
      !originGobId ||
      !destinationGobId
    ) {
      return;
    }

    const normalizedSense = sense.toUpperCase();
    if (normalizedSense !== 'I' && normalizedSense !== 'V') {
      return;
    }

    return {
      originGobId,
      destinationGobId,
      line,
      sense: normalizedSense,
    };
  }

  private buildTopic(data: SegmentAlertTopicData): string {
    return [
      SEE_BUS_SEGMENT_ALERT_TOPIC_PREFIX,
      data.line,
      data.sense,
      data.originGobId,
      data.destinationGobId,
    ].join(':');
  }

  private getChatType(chatId: string): 'private' | 'group' {
    return chatId.endsWith('@g.us') ? 'group' : 'private';
  }
}
