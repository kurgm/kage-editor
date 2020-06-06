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
  .case(editorActions.selectSingle, (state, index) => ({
    ...state,
    selection: [index],
  }))
  .case(editorActions.selectXorSingle, (state, index) => ({
    ...state,
    selection: state.selection.includes(index)
      ? state.selection.filter((index2) => index !== index2)
      : state.selection.concat([index])
  }))
  .case(editorActions.selectAll, (state) => ({
    ...state,
    selection: state.glyph.map((_gLine, index) => index),
  }))
  .case(editorActions.selectNone, (state) => ({
    ...state,
    selection: [],
  }))
  .case(editorActions.selectPrev, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? 0 : Math.min(...state.selection);
    return {
      ...state,
      selection: [(firstSelected - 1 + state.glyph.length) % state.glyph.length],
    };
  })
  .case(editorActions.selectNext, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? -1 : Math.max(...state.selection);
    return {
      ...state,
      selection: [(firstSelected + 1 + state.glyph.length) % state.glyph.length],
    };
  });

export default editor;
