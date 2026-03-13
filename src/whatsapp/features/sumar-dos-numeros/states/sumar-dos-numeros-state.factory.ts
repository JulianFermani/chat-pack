import { Injectable } from '@nestjs/common';

import { AddTwoNumbersState } from './add-two-numbers.state';
import { FirstNumberState } from './first-number.state';
import { SecondNumberState } from './second-number.state';
import { State } from '@shared/interfaces/state.interface';

@Injectable()
export class SumarDosNumerosStateFactory {
  private states: Map<number, State> = new Map();
  constructor(
    private first: FirstNumberState,
    private second: SecondNumberState,
    private addTwo: AddTwoNumbersState,
  ) {
    this.states.set(this.first.stepId, this.first);
    this.states.set(this.second.stepId, this.second);
    this.states.set(this.addTwo.stepId, this.addTwo);
  }

  get(step: number): State | undefined {
    return this.states.get(step);
  }
}
