import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  selectSingle: actionCreator<number>('SELECT_SINGLE'),
  selectXorSingle: actionCreator<number>('SELECT_XOR_SINGLE'),
  selectNone: actionCreator('SELECT_NONE'),
  selectAll: actionCreator('SELECT_ALL'),
  selectPrev: actionCreator('SELECT_PREV'),
  selectNext: actionCreator('SELECT_NEXT'),
};
