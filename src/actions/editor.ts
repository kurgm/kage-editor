import actionCreatorFactory from 'typescript-fsa';

import { StretchParam } from '../kageUtils/stretchparam';

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  loadedBuhin: actionCreator<[string, string]>('LOAD_BUHIN_DATA'),
  loadedStretchParam: actionCreator<[string, StretchParam]>('LOAD_STRETCH_PARAM'),

  swapWithPrev: actionCreator('SWAP_WITH_PREV'),
  swapWithNext: actionCreator('SWAP_WITH_NEXT'),

  undo: actionCreator('UNDO'),
  redo: actionCreator('REDO'),

  paste: actionCreator('PASTE'),
  copy: actionCreator('COPY_SELECTION'),
  cut: actionCreator('CUT_SELECTION'),
  decomposeSelected: actionCreator('DECOMPOSE_SELECTION'),

  toggleFreehand: actionCreator('TOGGLE_FREEHAND_MODE'),

  openOptionModal: actionCreator('OPEN_OPTION_MODAL'),
  closeOptionModal: actionCreator('CLOSE_OPTION_MODAL'),
};
