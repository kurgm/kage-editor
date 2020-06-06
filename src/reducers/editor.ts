import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { editorActions } from '../actions/editor';

export interface GlyphLine {
  value: number[];
  partName?: string;
}

export interface EditorState {
  glyph: GlyphLine[];
  selection: number[];
}

const initialState: EditorState = {
  glyph: [],
  selection: [],
};

const editor = reducerWithInitialState(initialState)
  .case(editorActions.selectSingle, (state, index) => (
    { ...state, selection: [index] }
  ));

export default editor;
