import actionCreatorFactory from 'typescript-fsa';

export type CTMInv = (x: number, y: number) => [number, number];
export enum RectPointPosition {
  north,
  south,
  east,
  west,
  southeast,
  southwest,
  northeast,
  northwest,
}

const actionCreator = actionCreatorFactory('EDITOR');

export const dragActions = {
  startBackgroundDrag: actionCreator<React.MouseEvent>('BACKGROUND_DRAG_START'),
  startSelectionDrag: actionCreator<React.MouseEvent>('SELECTION_DRAG_START'),
  startPointDrag: actionCreator<[React.MouseEvent, number]>('MOVE_POINT_START'),
  startResize: actionCreator<[React.MouseEvent, RectPointPosition]>('RESIZE_START'),

  mouseMove: actionCreator<MouseEvent>('MOUSE_MOVE'),
  mouseUp: actionCreator<MouseEvent>('MOUSE_UP'),

  updateCTMInv: actionCreator<CTMInv>('UPDATE_CTMINV'),
}
