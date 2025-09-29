import { forwardRef, Module } from '@nestjs/common';
import { WhatsappModule } from 'src/whatsapp/application/whatsapp.module';
import { SeeBusCommand } from './see-bus.command';
import { SeeBusHandler } from './see-bus.handler';
import { SeeBusInitState } from './states/see-bus-init.state';
import { SeeBusOriginState } from './states/see-bus-origin.state';
import { SeeBusDestinationState } from './states/see-bus-destination.state';
import { SeeBusMapState } from './states/see-bus-map.state';
import { ConfigModule } from '@nestjs/config';
import { SeeBusStateFactory } from './states/see-bus-state.factory';

@Module({
  imports: [forwardRef(() => WhatsappModule), ConfigModule.forRoot()],
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
