import { Injectable } from '@nestjs/common';

import { SeeBusDestinationState } from './see-bus-destination.state';
import { SeeBusInitState } from './see-bus-init.state';
import { SeeBusMapState } from './see-bus-map.state';
import { SeeBusOriginState } from './see-bus-origin.state';
import { State } from '@shared/interfaces/state.interface';
@Injectable()
export class SeeBusStateFactory {
  private states: Map<number, State> = new Map();

  constructor(
    private init: SeeBusInitState,
    private origin: SeeBusOriginState,
    private dest: SeeBusDestinationState,
    private map: SeeBusMapState,
  ) {
    this.states.set(this.init.stepId, this.init);
    this.states.set(this.origin.stepId, this.origin);
    this.states.set(this.dest.stepId, this.dest);
    this.states.set(this.map.stepId, this.map);
  }

  get(step: number): State | undefined {
    return this.states.get(step);
  }
}
