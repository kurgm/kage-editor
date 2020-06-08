import React from 'react';

import { EditorControlsStateProps, EditorControlsActions } from '../containers/EditorControls';
import './EditorControls.css';
import { useTranslation } from 'react-i18next';

interface OwnProps {
}

type EditorControlsProps = OwnProps & EditorControlsStateProps & EditorControlsActions;

const EditorControls = (props: EditorControlsProps) => {
  const { t } = useTranslation();
  return (
    <div className="editor-controls">
      <div className="selection-info">
        selection info.
      </div>
      <div className="control-buttons">
        <button
          disabled={props.undoDisabled}
          onClick={props.undo}
        >
          {t('undo')}
        </button>
        <button
          disabled={props.redoDisabled}
          onClick={props.redo}
        >
          {t('redo')}
        </button>
        <button
          disabled={props.freehandMode}
          onClick={props.selectAll}
        >
          {t('select all')}
        </button>
        <button
          disabled={props.freehandMode}
          onClick={props.selectDeselected}
        >
          {t('invert selection')}
        </button>
        <button
          disabled={props.selection.length === 0 || true}
          onClick={props.copy}
        >
          {t('copy')}
        </button>
        <button
          disabled={props.pasteDisabled}
          onClick={props.paste}
        >
          {t('paste')}
        </button>
        <button
          disabled={props.selection.length === 0 || true}
          onClick={props.cut}
        >
          {t('cut')}
        </button>
        <button
          disabled
          onClick={props.toggleFreehand}
        >
          {props.freehandMode ? t('end freehand') : t('start freehand')}
        </button>
        <button
          disabled={props.decomposeDisabled}
          onClick={props.decompose}
        >
          {t('decompose')}
        </button>
        <button
          disabled
          onClick={props.options}
        >
          {t('options')}
        </button>
      </div>
      <div className="preview">
        <svg className="preview-thumbnail" viewBox="0 0 200 200" width="50" height="50"></svg>
        <button
          disabled
          onClick={props.finishEdit}
        >
          {t('finish edit')}
        </button>
      </div>
    </div>
  );
};

export default EditorControls;
