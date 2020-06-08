import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createSelector } from 'reselect';

import { editorActions } from '../actions/editor';
import { selectActions } from '../actions/select';

import { AppState } from '../reducers';
import { Glyph } from '../kageUtils/glyph';

import EditorControls from '../components/EditorControls';

export interface EditorControlsStateProps {
  glyph: Glyph;
  buhinMap: Map<string, string>;
  selection: number[];

  undoDisabled: boolean;
  redoDisabled: boolean;
  pasteDisabled: boolean;
  decomposeDisabled: boolean;

  freehandMode: boolean;
};

export interface EditorControlsActions {
  undo: () => void;
  redo: () => void;
  selectAll: () => void;
  selectDeselected: () => void;
  copy: () => void;
  paste: () => void;
  cut: () => void;
  toggleFreehand: () => void;
  decompose: () => void;
  options: () => void;
  finishEdit: () => void;
};

const mapStateToProps = createSelector([
  (state: AppState) => state.glyph,
  (state: AppState) => state.buhinMap,
  (state: AppState) => state.selection,
  (state: AppState) => state.clipboard,
  (state: AppState) => state.freehandMode,
], (glyph, buhinMap, selection, clipboard, freehandMode): EditorControlsStateProps => ({
  glyph,
  buhinMap,
  selection,

  undoDisabled: true,
  redoDisabled: true,
  pasteDisabled: clipboard.length === 0,
  decomposeDisabled: !selection.some((index) => glyph[index].value[0] === 99),

  freehandMode,
}));

const mapDispatchToProps = (dispatch: Dispatch): EditorControlsActions => ({
  undo: () => {
    dispatch(editorActions.undo());
  },
  redo: () => {
    dispatch(editorActions.redo());
  },
  selectAll: () => {
    dispatch(selectActions.selectAll());
  },
  selectDeselected: () => {
    dispatch(selectActions.selectDeselected());
  },
  copy: () => {
    dispatch(editorActions.copy());
  },
  paste: () => {
    dispatch(editorActions.paste());
  },
  cut: () => {
    dispatch(editorActions.cut());
  },
  toggleFreehand: () => {
    dispatch(editorActions.toggleFreehand());
  },
  decompose: () => {
    dispatch(editorActions.decomposeSelected());
  },
  options: () => {
    dispatch(editorActions.openOptionModal());
  },
  finishEdit: () => {
    // FIXME
    // location.href = ...
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorControls);
