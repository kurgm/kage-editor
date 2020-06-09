import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('UNDO');

export const undoActions = {
  undo: actionCreator('UNDO'),
  redo: actionCreator('REDO'),
};
