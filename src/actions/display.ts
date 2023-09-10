import actionCreatorFactory from 'typescript-fsa';

import { KShotai } from '../kage';
import { showCenterLine } from '../components/OptionModal';
import { XorMaskType } from '../xorMask';

const actionCreator = actionCreatorFactory('DISPLAY');

export const displayActions = {
  openOptionModal: actionCreator('OPEN_OPTION_MODAL'),
  closeOptionModal: actionCreator('CLOSE_OPTION_MODAL'),

  setGridDisplay: actionCreator<boolean>('SET_GRID_DISPLAY'),
  setGridOriginX: actionCreator<number>('SET_GRID_ORIGIN_X'),
  setGridOriginY: actionCreator<number>('SET_GRID_ORIGIN_Y'),
  setGridSpacingX: actionCreator<number>('SET_GRID_SPACING_X'),
  setGridSpacingY: actionCreator<number>('SET_GRID_SPACING_Y'),

  setShotai: actionCreator<KShotai>('SET_SHOTAI'),
  setStrokeCenterLineDisplay: actionCreator<showCenterLine>('SET_STROKE_CENTER_LINE_DISPLAY'),

  setXorMaskType: actionCreator<XorMaskType>('SET_XOR_MASK_TYPE'),
};
