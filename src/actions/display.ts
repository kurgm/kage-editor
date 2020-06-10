import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('DISPLAY');

export const displayActions = {
  openOptionModal: actionCreator('OPEN_OPTION_MODAL'),
  closeOptionModal: actionCreator('CLOSE_OPTION_MODAL'),

  setGridDisplay: actionCreator<boolean>('SET_GRID_DISPLAY'),
  setGridOriginX: actionCreator<number>('SET_GRID_ORIGIN_X'),
  setGridOriginY: actionCreator<number>('SET_GRID_ORIGIN_Y'),
  setGridSpacingX: actionCreator<number>('SET_GRID_SPACING_X'),
  setGridSpacingY: actionCreator<number>('SET_GRID_SPACING_Y'),

  setStrokeCenterLineDisplay: actionCreator<boolean>('SET_STROKE_CENTER_LINE_DISPLAY'),
};
