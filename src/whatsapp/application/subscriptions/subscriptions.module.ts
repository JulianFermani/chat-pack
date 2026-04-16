import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';

import { subscriptionModelProvider } from './subscription.provider';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    subscriptionModelProvider,
    SubscriptionRepository,
    SubscriptionService,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionsModule {}
