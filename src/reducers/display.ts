import { ReducerBuilder } from 'typescript-fsa-reducers';

import { displayActions } from '../actions/display';

import { AppState } from '.';

export interface GridState {
  display: boolean;
  originX: number;
  originY: number;
  spacingX: number;
  spacingY: number;
}

const updateBuilder = (builder: ReducerBuilder<AppState>) => builder
  .case(displayActions.openOptionModal, (state) => ({
    ...state,
    showOptionModal: true,
  }))
  .case(displayActions.closeOptionModal, (state) => ({
    ...state,
    showOptionModal: false,
  }))

  .case(displayActions.setGridDisplay, (state, value) => ({
    ...state,
    grid: {
      ...state.grid,
      display: value,
    },
  }))
  .case(displayActions.setGridOriginX, (state, value) => ({
    ...state,
    grid: {
      ...state.grid,
      originX: value,
    },
  }))
  .case(displayActions.setGridOriginY, (state, value) => ({
    ...state,
    grid: {
      ...state.grid,
      originY: value,
    },
  }))
  .case(displayActions.setGridSpacingX, (state, value) => ({
    ...state,
    grid: {
      ...state.grid,
      spacingX: Math.max(2, value),
    },
  }))
  .case(displayActions.setGridSpacingY, (state, value) => ({
    ...state,
    grid: {
      ...state.grid,
      spacingY: Math.max(2, value),
    },
  }))

  .case(displayActions.setStrokeCenterLineDisplay, (state, value) => ({
    ...state,
    showStrokeCenterLine: value,
  }))
  .case(displayActions.setShotai, (state, shotai) => ({
    ...state,
    shotai,
  }))

  .case(displayActions.setXorMaskType, (state, xorMaskType) => ({
    ...state,
    xorMaskType,
  }));


export default updateBuilder;
