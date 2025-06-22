// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020  kurgm

import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('SELECT');

export const selectActions = {
  selectSingle: actionCreator<number>('SELECT_SINGLE'),
  selectAddSingle: actionCreator<number>('SELECT_ADD_SINGLE'),
  selectRemoveSingle: actionCreator<number>('SELECT_REMOVE_SINGLE'),
  selectNone: actionCreator('SELECT_NONE'),
  selectAll: actionCreator('SELECT_ALL'),
  selectDeselected: actionCreator('SELECT_TOGGLE_ALL'),
  selectPrev: actionCreator('SELECT_PREV'),
  selectNext: actionCreator('SELECT_NEXT'),
};
