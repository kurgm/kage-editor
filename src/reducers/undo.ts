import { Reducer } from '@reduxjs/toolkit';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { isGlyphDeepEqual } from '../kageUtils/glyph';

import { undoActions } from '../actions/undo';

import { AppState } from '.';

const UNDO_MAX_TIMES = 30;

const pushUndo = (oldState: AppState, newState: AppState): AppState => {
  if (isGlyphDeepEqual(oldState.glyph, newState.glyph)) {
    return newState;
  }
  return {
    ...newState,
    undoStacks: {
      undo: oldState.undoStacks.undo.concat([oldState.glyph]).slice(-UNDO_MAX_TIMES),
      redo: [],
    },
  };
};

export const undoable = (reducer: Reducer<AppState>): Reducer<AppState> => {
  const initialState = reducer(undefined, { type: '_INIT' });
  return reducerWithInitialState(initialState)
    .case(undoActions.undo, (state) => {
      if (state.undoStacks.undo.length === 0) {
        return state;
      }
      return {
        ...state,
        glyph: state.undoStacks.undo[state.undoStacks.undo.length - 1],
        selection: [], // TODO: select changed lines?
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
        selection: [], // TODO: select changed lines?
        undoStacks: {
          undo: state.undoStacks.undo.concat([state.glyph]),
          redo: state.undoStacks.redo.slice(0, -1),
        },
      };
    })
    .default((oldState, action) => {
      const newState = reducer(oldState, action);
      if (!oldState) {
        return newState;
      }
      return pushUndo(oldState, newState);
    });
};
