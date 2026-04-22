import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SeeBusCommand } from './see-bus.command';
import { SeeBusHandler } from './see-bus.handler';
import { SeeBusDestinationState } from './states/see-bus-destination.state';
import { SeeBusInitState } from './states/see-bus-init.state';
import { SeeBusMapState } from './states/see-bus-map.state';
import { SeeBusOriginState } from './states/see-bus-origin.state';
import { SeeBusStateFactory } from './states/see-bus-state.factory';
import { WhatsappModule } from '@client/whatsapp.module';
import { CommandRegistryModule } from '@command-registry/command-registry.module';

@Module({
  imports: [WhatsappModule, ConfigModule.forRoot(), CommandRegistryModule],
  providers: [
    SeeBusCommand,
    SeeBusHandler,
    SeeBusStateFactory,
    SeeBusInitState,
    SeeBusOriginState,
    SeeBusDestinationState,
    SeeBusMapState,
  ],
  exports: [SeeBusCommand],
})
export class SeeBusModule {}
