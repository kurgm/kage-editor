import actionCreatorFactory from 'typescript-fsa';

export type CTMInv = (x: number, y: number) => [number, number];

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  selectSingle: actionCreator<number>('SELECT_SINGLE'),
  selectXorSingle: actionCreator<number>('SELECT_XOR_SINGLE'),
  selectSingleIfNotSelected: actionCreator<number>('SELECT_SINGLE_IF_NOT_SELECTED'),
  selectNone: actionCreator('SELECT_NONE'),
  selectAll: actionCreator('SELECT_ALL'),
  selectPrev: actionCreator('SELECT_PREV'),
  selectNext: actionCreator('SELECT_NEXT'),

  startAreaSelect: actionCreator<React.MouseEvent>('AREA_SELECT_START'),
  startSelectionDrag: actionCreator<React.MouseEvent>('SELECTION_DRAG_START'),

  mouseMove: actionCreator<MouseEvent>('MOUSE_MOVE'),
  mouseUp: actionCreator<MouseEvent>('MOUSE_UP'),

  updateCTMInv: actionCreator<CTMInv>('UPDATE_CTMINV'),
};
