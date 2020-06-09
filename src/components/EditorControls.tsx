import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { AppState } from '../reducers';
import { editorActions } from '../actions/editor';
import { selectActions } from '../actions/select';

import SelectionInfo from './SelectionInfo';
import SubmitPreview from './SubmitPreview';

import './EditorControls.css';

const EditorControls = () => {
  const glyph = useSelector((state: AppState) => state.glyph);
  const selection = useSelector((state: AppState) => state.selection);
  const clipboard = useSelector((state: AppState) => state.clipboard);
  const freehandMode = useSelector((state: AppState) => state.freehandMode);

  const undoDisabled = true;
  const redoDisabled = true;
  const pasteDisabled = clipboard.length === 0;
  const decomposeDisabled = !selection.some((index) => glyph[index].value[0] === 99);

  const dispatch = useDispatch();
  const undo = useCallback(() => {
    dispatch(editorActions.undo());
  }, [dispatch]);
  const redo = useCallback(() => {
    dispatch(editorActions.redo());
  }, [dispatch]);
  const selectAll = useCallback(() => {
    dispatch(selectActions.selectAll());
  }, [dispatch]);
  const selectDeselected = useCallback(() => {
    dispatch(selectActions.selectDeselected());
  }, [dispatch]);
  const copy = useCallback(() => {
    dispatch(editorActions.copy());
  }, [dispatch]);
  const paste = useCallback(() => {
    dispatch(editorActions.paste());
  }, [dispatch]);
  const cut = useCallback(() => {
    dispatch(editorActions.cut());
  }, [dispatch]);
  const toggleFreehand = useCallback(() => {
    dispatch(editorActions.toggleFreehand());
  }, [dispatch]);
  const decompose = useCallback(() => {
    dispatch(editorActions.decomposeSelected());
  }, [dispatch]);
  const options = useCallback(() => {
    dispatch(editorActions.openOptionModal());
  }, [dispatch]);
  const finishEdit = useCallback(() => {
    dispatch(editorActions.finishEdit());
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="editor-controls">
      <SelectionInfo />
      <div className="control-buttons">
        <button
          disabled={undoDisabled}
          onClick={undo}
        >
          {t('undo')}
        </button>
        <button
          disabled={redoDisabled}
          onClick={redo}
        >
          {t('redo')}
        </button>
        <button
          disabled={freehandMode || glyph.length === 0}
          onClick={selectAll}
        >
          {t('select all')}
        </button>
        <button
          disabled={freehandMode || glyph.length === 0}
          onClick={selectDeselected}
        >
          {t('invert selection')}
        </button>
        <button
          disabled={selection.length === 0}
          onClick={copy}
        >
          {t('copy')}
        </button>
        <button
          disabled={pasteDisabled}
          onClick={paste}
        >
          {t('paste')}
        </button>
        <button
          disabled={selection.length === 0}
          onClick={cut}
        >
          {t('cut')}
        </button>
        <button
          disabled
          onClick={toggleFreehand}
        >
          {freehandMode ? t('end freehand') : t('start freehand')}
        </button>
        <button
          disabled={decomposeDisabled}
          onClick={decompose}
        >
          {t('decompose')}
        </button>
        <button
          disabled
          onClick={options}
        >
          {t('options')}
        </button>
      </div>
      <div className="preview">
        <SubmitPreview />
        <button onClick={finishEdit}>
          {t('finish edit')}
        </button>
      </div>
    </div>
  );
};

export default EditorControls;
