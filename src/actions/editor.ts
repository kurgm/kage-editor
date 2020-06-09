import actionCreatorFactory from 'typescript-fsa';

import { StretchParam } from '../kageUtils/stretchparam';

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  loadedBuhin: actionCreator<[string, string]>('LOAD_BUHIN_DATA'),
  loadedStretchParam: actionCreator<[string, StretchParam]>('LOAD_STRETCH_PARAM'),

  changeStrokeType: actionCreator<number>('CHANGE_STROKE_TYPE'),
  changeHeadShapeType: actionCreator<number>('CHANGE_HEAD_SHAPE_TYPE'),
  changeTailShapeType: actionCreator<number>('CHANGE_TAIL_SHAPE_TYPE'),
  changeStretchCoeff: actionCreator<number>('CHANGE_STRETCH_COEFF'),

  swapWithPrev: actionCreator('SWAP_WITH_PREV'),
  swapWithNext: actionCreator('SWAP_WITH_NEXT'),

  insertPart: actionCreator<string>('ADD_PART'),

  undo: actionCreator('UNDO'),
  redo: actionCreator('REDO'),

  paste: actionCreator('PASTE'),
  copy: actionCreator('COPY_SELECTION'),
  cut: actionCreator('CUT_SELECTION'),
  delete: actionCreator('DELETE_SELECTION'),
  decomposeSelected: actionCreator('DECOMPOSE_SELECTION'),
  moveSelected: actionCreator<[number, number]>('MOVE_SELECTED'),

  toggleFreehand: actionCreator('TOGGLE_FREEHAND_MODE'),

  openOptionModal: actionCreator('OPEN_OPTION_MODAL'),
  closeOptionModal: actionCreator('CLOSE_OPTION_MODAL'),

  finishEdit: actionCreator('FINISH_EDIT'),
};
