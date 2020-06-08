import { ReducerBuilder } from 'typescript-fsa-reducers';

import { selectActions } from '../actions/select';

import { AppState } from '.';

export default (builder: ReducerBuilder<AppState>) => builder
  .case(selectActions.selectSingle, (state, index) => ({
    ...state,
    selection: [index],
  }))
  .case(selectActions.selectAddSingle, (state, index) => ({
    ...state,
    selection: state.selection.includes(index) ? state.selection : state.selection.concat([index]),
  }))
  .case(selectActions.selectRemoveSingle, (state, index) => ({
    ...state,
    selection: state.selection.filter((index2) => index !== index2),
  }))
  .case(selectActions.selectAll, (state) => ({
    ...state,
    selection: state.glyph.map((_gLine, index) => index),
  }))
  .case(selectActions.selectDeselected, (state) => ({
    ...state,
    selection: state.glyph.map((_gLine, index) => index).filter((index) => !state.selection.includes(index)),
  }))
  .case(selectActions.selectNone, (state) => ({
    ...state,
    selection: [],
  }))
  .case(selectActions.selectPrev, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? 0 : Math.min(...state.selection);
    return {
      ...state,
      selection: [(firstSelected - 1 + state.glyph.length) % state.glyph.length],
    };
  })
  .case(selectActions.selectNext, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? -1 : Math.max(...state.selection);
    return {
      ...state,
      selection: [(firstSelected + 1 + state.glyph.length) % state.glyph.length],
    };
  });
