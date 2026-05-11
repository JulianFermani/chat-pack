import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SubscriptionsModule } from '@application/subscriptions/subscriptions.module';
import { SeeBusCommand } from './see-bus.command';
import { SeeBusHandler } from './see-bus.handler';
import { SeeBusDestinationState } from './states/see-bus-destination.state';
import { SeeBusInitState } from './states/see-bus-init.state';
import { SeeBusMapState } from './states/see-bus-map.state';
import { SeeBusOriginState } from './states/see-bus-origin.state';
import { SeeBusStateFactory } from './states/see-bus-state.factory';
import { SegmentAlertNotifierService } from './segment-alert/segment-alert-notifier.service';
import { SegmentAlertSubscriptionService } from './segment-alert/segment-alert-subscription.service';
import { SegmentAlertHandler } from './segment-alert/segment-alert.handler';
import { SubscribeSegmentAlertCommand } from './segment-alert/subscribe-segment-alert.command';
import { SegmentAlertDestinationState } from './segment-alert/states/segment-alert-destination.state';
import { SegmentAlertInitState } from './segment-alert/states/segment-alert-init.state';
import { SegmentAlertLineAndSenseState } from './segment-alert/states/segment-alert-line-and-sense.state';
import { SegmentAlertOriginState } from './segment-alert/states/segment-alert-origin.state';
import { SegmentAlertStateFactory } from './segment-alert/states/segment-alert-state.factory';
import { UnsubscribeSegmentAlertCommand } from './segment-alert/unsubscribe-segment-alert.command';
import { UnsubscribeSegmentAlertHandler } from './segment-alert/unsubscribe-segment-alert.handler';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [
    WhatsappModule,
    ConfigModule.forRoot(),
    CommandRegistryModule,
    SubscriptionsModule,
  ],
  providers: [
    SeeBusCommand,
    SeeBusHandler,
    SeeBusStateFactory,
    SeeBusInitState,
    SeeBusOriginState,
    SeeBusDestinationState,
    SeeBusMapState,
    SubscribeSegmentAlertCommand,
    UnsubscribeSegmentAlertCommand,
    UnsubscribeSegmentAlertHandler,
    SegmentAlertHandler,
    SegmentAlertStateFactory,
    SegmentAlertInitState,
    SegmentAlertOriginState,
    SegmentAlertDestinationState,
    SegmentAlertLineAndSenseState,
    SegmentAlertSubscriptionService,
    SegmentAlertNotifierService,
  ],
  exports: [SeeBusCommand],
})
export class SeeBusModule {}
