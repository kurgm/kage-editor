import actionCreatorFactory from 'typescript-fsa';

import { StretchParam } from '../kageUtils/stretchparam';

export type CTMInv = (x: number, y: number) => [number, number];
export enum RectPointPosition {
  north,
  south,
  east,
  west,
  southeast,
}

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  selectSingle: actionCreator<number>('SELECT_SINGLE'),
  selectAddSingle: actionCreator<number>('SELECT_ADD_SINGLE'),
  selectRemoveSingle: actionCreator<number>('SELECT_REMOVE_SINGLE'),
  selectNone: actionCreator('SELECT_NONE'),
  selectAll: actionCreator('SELECT_ALL'),
  selectDeselected: actionCreator('SELECT_TOGGLE_ALL'),
  selectPrev: actionCreator('SELECT_PREV'),
  selectNext: actionCreator('SELECT_NEXT'),

  startAreaSelect: actionCreator<React.MouseEvent>('AREA_SELECT_START'),
  startSelectionDrag: actionCreator<React.MouseEvent>('SELECTION_DRAG_START'),
  startPointDrag: actionCreator<[React.MouseEvent, number]>('MOVE_POINT_START'),
  startResize: actionCreator<[React.MouseEvent, RectPointPosition]>('RESIZE_START'),

  mouseMove: actionCreator<MouseEvent>('MOUSE_MOVE'),
  mouseUp: actionCreator<MouseEvent>('MOUSE_UP'),

  updateCTMInv: actionCreator<CTMInv>('UPDATE_CTMINV'),

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
