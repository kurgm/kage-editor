import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { editorActions } from '../actions/editor';
import EditorControls from '../components/EditorControls';
import { AppState } from '../reducers';
import { applyDraggingEffectToGlyph } from '../reducers/editor';

import { Glyph } from '../kageUtils/glyph';

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

const mapStateToProps = (state: AppState): EditorControlsStateProps => ({
  glyph: applyDraggingEffectToGlyph(state.editor),
  buhinMap: state.editor.buhinMap,
  selection: state.editor.selection,

  undoDisabled: true,
  redoDisabled: true,
  pasteDisabled: state.editor.clipboard.length === 0,
  decomposeDisabled: true,

  freehandMode: state.editor.freehandMode,
});

const mapDispatchToProps = (dispatch: Dispatch): EditorControlsActions => ({
  undo: () => {
    dispatch(editorActions.undo());
  },
  redo: () => {
    dispatch(editorActions.redo());
  },
  selectAll: () => {
    dispatch(editorActions.selectAll());
  },
  selectDeselected: () => {
    dispatch(editorActions.selectDeselected());
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
