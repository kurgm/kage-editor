// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020  kurgm

import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('UNDO');

export const undoActions = {
  undo: actionCreator('UNDO'),
  redo: actionCreator('REDO'),
};
