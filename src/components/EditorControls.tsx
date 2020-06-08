import React from 'react';

import { EditorState } from '../reducers/editor';

import { EditorControlsActions } from '../containers/EditorControls';
import './EditorControls.css';
import { useTranslation } from 'react-i18next';

interface OwnProps {
}

type EditorControlsProps = OwnProps & EditorState & EditorControlsActions;

const EditorControls = (props: EditorControlsProps) => {
  const { t } = useTranslation();
  return (
    <div className="editor-controls">
      <div className="selection-info">
        selection info.
      </div>
      <div className="control-buttons">
        <button disabled>{t('undo')}</button>
        <button disabled>{t('redo')}</button>
        <button disabled>{t('select all')}</button>
        <button disabled>{t('invert selection')}</button>
        <button disabled>{t('copy')}</button>
        <button disabled>{t('paste')}</button>
        <button disabled>{t('cut')}</button>
        <button disabled>{t('start freehand')}</button>
        <button disabled>{t('decompose')}</button>
        <button disabled>{t('options')}</button>
      </div>
      <div className="preview">
        <svg className="preview-thumbnail" viewBox="0 0 200 200" width="50" height="50"></svg>
        <button disabled>{t('finish edit')}</button>
      </div>
    </div>
  );
};

export default EditorControls;
