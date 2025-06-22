// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020  kurgm

import actionCreatorFactory from 'typescript-fsa';

import { StretchParam } from '../kageUtils/stretchparam';
import { ReflectRotateType } from '../kageUtils/reflectrotate';

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  loadedBuhin: actionCreator<[string, string]>('LOAD_BUHIN_DATA'),
  loadedStretchParam: actionCreator<[string, StretchParam]>('LOAD_STRETCH_PARAM'),

  changeStrokeType: actionCreator<number>('CHANGE_STROKE_TYPE'),
  changeHeadShapeType: actionCreator<number>('CHANGE_HEAD_SHAPE_TYPE'),
  changeTailShapeType: actionCreator<number>('CHANGE_TAIL_SHAPE_TYPE'),
  changeStretchCoeff: actionCreator<number>('CHANGE_STRETCH_COEFF'),
  changeReflectRotateOpType: actionCreator<ReflectRotateType>('CHANGE_REFLECT_ROTATE_OPTYPE'),

  swapWithPrev: actionCreator('SWAP_WITH_PREV'),
  swapWithNext: actionCreator('SWAP_WITH_NEXT'),

  insertPart: actionCreator<string>('ADD_PART'),

  paste: actionCreator('PASTE'),
  copy: actionCreator('COPY_SELECTION'),
  cut: actionCreator('CUT_SELECTION'),
  delete: actionCreator('DELETE_SELECTION'),
  decomposeSelected: actionCreator('DECOMPOSE_SELECTION'),
  moveSelected: actionCreator<[number, number]>('MOVE_SELECTED'),

  toggleFreehand: actionCreator('TOGGLE_FREEHAND_MODE'),

  escape: actionCreator('PRESS_ESC_KEY'),

  finishEdit: actionCreator<Event>('FINISH_EDIT'),
};
