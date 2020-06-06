import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { editorActions } from '../actions/editor';
import { Glyph, parseGlyph } from '../kageUtils';

import args from '../args';


export interface EditorState {
  glyph: Glyph;
  selection: number[];
}

const initialState: EditorState = {
  glyph: parseGlyph(args.get('data') || ''),
  selection: [],
};

const editor = reducerWithInitialState(initialState)
  .case(editorActions.selectSingle, (state, index) => (
    { ...state, selection: [index] }
  ));

export default editor;
