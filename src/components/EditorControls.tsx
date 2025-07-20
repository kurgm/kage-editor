// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2025  kurgm

import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../hooks';
import { editorActions } from '../actions/editor';
import { selectActions } from '../actions/select';
import { undoActions } from '../actions/undo';
import { displayActions } from '../actions/display';

import SelectionInfo from './SelectionInfo';
import SubmitPreview from './SubmitPreview';

import './EditorControls.css';

const EditorControls = () => {
  const glyph = useAppSelector((state) => state.glyph);
  const selection = useAppSelector((state) => state.selection);
  const clipboard = useAppSelector((state) => state.clipboard);
  const freehandMode = useAppSelector((state) => state.freehandMode);
  const undoLength = useAppSelector((state) => state.undoStacks.undo.length);
  const redoLength = useAppSelector((state) => state.undoStacks.redo.length);

  const undoDisabled = undoLength === 0;
  const redoDisabled = redoLength === 0;
  const pasteDisabled = clipboard.length === 0;
  const decomposeDisabled = !selection.some((index) => glyph[index].value[0] === 99);

  const dispatch = useAppDispatch();
  const undo = useCallback(() => {
    dispatch(undoActions.undo());
  }, [dispatch]);
  const redo = useCallback(() => {
    dispatch(undoActions.redo());
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
    dispatch(displayActions.openOptionModal());
  }, [dispatch]);
  const finishEdit = useCallback((evt: React.MouseEvent) => {
    dispatch(editorActions.finishEdit(evt.nativeEvent));
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="editorControls">
      <SelectionInfo />
      <div className="controlButtons">
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
          disabled={glyph.length === 0}
          onClick={selectAll}
        >
          {t('select all')}
        </button>
        <button
          disabled={glyph.length === 0}
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
          onClick={options}
        >
          {t('options')}
        </button>
      </div>
      <div className="preview">
        <SubmitPreview className="previewThumbnail" />
        <button onClick={finishEdit}>
          {t('finish edit')}
        </button>
      </div>
    </div>
  );
};

export default EditorControls;
