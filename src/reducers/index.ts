import { combineReducers } from 'redux';

import editor, { EditorState } from './editor';

export type AppState = {
  editor: EditorState;
};

export default combineReducers<AppState>({
  editor,
});
