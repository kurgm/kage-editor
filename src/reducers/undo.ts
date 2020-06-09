import { ReducerBuilder } from 'typescript-fsa-reducers';

import { isGlyphDeepEqual } from "../kageUtils/glyph";

import { undoActions } from '../actions/undo';

import { AppState } from ".";

const UNDO_MAX_TIMES = 30;

export const pushUndo = (state1: AppState, state2: AppState): AppState => {
  if (isGlyphDeepEqual(state1.glyph, state2.glyph)) {
    return state2;
  }
  return {
    ...state2,
    undoStacks: {
      undo: state1.undoStacks.undo.concat([state1.glyph]).slice(-UNDO_MAX_TIMES),
      redo: [],
    },
  };
};


export const undoReduceBuilder = (builder: ReducerBuilder<AppState>) => builder
  .case(undoActions.undo, (state) => {
    if (state.undoStacks.undo.length === 0) {
      return state;
    }
    return {
      ...state,
      glyph: state.undoStacks.undo[state.undoStacks.undo.length - 1],
      undoStacks: {
        undo: state.undoStacks.undo.slice(0, -1),
        redo: state.undoStacks.redo.concat([state.glyph]),
      },
    };
  })
  .case(undoActions.redo, (state) => {
    if (state.undoStacks.redo.length === 0) {
      return state;
    }
    return {
      ...state,
      glyph: state.undoStacks.redo[state.undoStacks.redo.length - 1],
      undoStacks: {
        undo: state.undoStacks.undo.concat([state.glyph]),
        redo: state.undoStacks.redo.slice(0, -1),
      },
    };
  });
