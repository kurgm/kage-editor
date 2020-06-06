import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('EDITOR');

export const editorActions = {
  selectSingle: actionCreator<number>('SELECT_SINGLE'),
};
