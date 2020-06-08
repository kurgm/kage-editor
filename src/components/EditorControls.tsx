import React from 'react';

import { useTranslation } from 'react-i18next';

import SelectionInfo from '../containers/SelectionInfo';

import { EditorControlsStateProps, EditorControlsActions } from '../containers/EditorControls';
import './EditorControls.css';

interface OwnProps {
}

type EditorControlsProps = OwnProps & EditorControlsStateProps & EditorControlsActions;

const EditorControls = (props: EditorControlsProps) => {
  const { t } = useTranslation();
  return (
    <div className="editor-controls">
      <SelectionInfo />
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
          disabled={props.freehandMode || props.glyph.length === 0}
          onClick={props.selectAll}
        >
          {t('select all')}
        </button>
        <button
          disabled={props.freehandMode || props.glyph.length === 0}
          onClick={props.selectDeselected}
        >
          {t('invert selection')}
        </button>
        <button
          disabled={props.selection.length === 0}
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
          disabled={props.selection.length === 0}
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
