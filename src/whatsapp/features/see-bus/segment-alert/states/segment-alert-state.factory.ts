import { Injectable } from '@nestjs/common';

import { State } from '@shared/interfaces/state.interface';
import { SegmentAlertDestinationState } from './segment-alert-destination.state';
import { SegmentAlertInitState } from './segment-alert-init.state';
import { SegmentAlertLineAndSenseState } from './segment-alert-line-and-sense.state';
import { SegmentAlertOriginState } from './segment-alert-origin.state';

@Injectable()
export class SegmentAlertStateFactory {
  private readonly states: Map<string, State> = new Map();

  constructor(
    private readonly init: SegmentAlertInitState,
    private readonly origin: SegmentAlertOriginState,
    private readonly destination: SegmentAlertDestinationState,
    private readonly lineAndSense: SegmentAlertLineAndSenseState,
  ) {
    this.states.set(this.init.stepId, this.init);
    this.states.set(this.origin.stepId, this.origin);
    this.states.set(this.destination.stepId, this.destination);
    this.states.set(this.lineAndSense.stepId, this.lineAndSense);
  }

  get(step: string): State | undefined {
    return this.states.get(step);
  }
}
