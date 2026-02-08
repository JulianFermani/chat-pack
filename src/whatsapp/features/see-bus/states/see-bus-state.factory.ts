import { Injectable } from '@nestjs/common';
import { State } from '../../../shared/interfaces/state.interface';
import { SeeBusInitState } from './see-bus-init.state';
import { SeeBusOriginState } from './see-bus-origin.state';
import { SeeBusDestinationState } from './see-bus-destination.state';
import { SeeBusMapState } from './see-bus-map.state';

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
