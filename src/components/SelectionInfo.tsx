import React, { useCallback } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';

import { editorActions } from '../actions/editor';
import { selectActions } from '../actions/select';
import { AppState } from '../reducers';
import { calcStretchScalar, getStretchPositions } from '../kageUtils/stretchparam';
import { strokeTypes, headShapeTypes, tailShapeTypes } from '../kageUtils/stroketype';

import { useTranslation } from 'react-i18next';

import './SelectionInfo.css'


interface StrokeInfo {
  strokeType: number;
  headShapeType: number;
  tailShapeType: number;
  coordString: string;
}
const strokeInfoSelector = createSelector([
  (state: AppState) => state.selection,
  (state: AppState) => state.selection.length ? state.glyph[state.selection[0]] : null,
], (selection, selectedStroke_): StrokeInfo | null => {
  if (selection.length !== 1) {
    return null;
  }
  const selectedStroke = selectedStroke_!;
  if (!strokeTypes.includes(selectedStroke.value[0])) {
    return null;
  }

  const points = [];
  for (let i = 3; i + 2 <= selectedStroke.value.length; i += 2) {
    points.push(`(${selectedStroke.value[i]},${selectedStroke.value[i + 1]})`);
  }
  return {
    strokeType: selectedStroke.value[0],
    headShapeType: selectedStroke.value[1],
    tailShapeType: selectedStroke.value[2],
    coordString: points.join(' → '),
  };
});

interface PartInfo {
  partName: string;
  entityName: string | null;
  coordString: string;
  stretchCoeff: number | null;
}
const partInfoSelector = createSelector([
  (state: AppState) => state.selection,
  (state: AppState) => state.selection.length ? state.glyph[state.selection[0]] : null,
  (state: AppState) => state.buhinMap,
  (state: AppState) => state.stretchParamMap,
], (selection, selectedStroke_, buhinMap, stretchParamMap): PartInfo | null => {
  if (selection.length !== 1) {
    return null;
  }
  const selectedStroke = selectedStroke_!;
  if (selectedStroke.value[0] !== 99) {
    return null;
  }
  const partName = selectedStroke.partName!;
  const buhinSource = buhinMap.get(partName);
  let entityName: string | null = null;
  if (buhinSource) {
    const aliasMatch = /^(?:0:1:0:[^$]+\$)?99:0:0:0:0:200:200:([^$]+)$/.exec(buhinSource);
    if (aliasMatch) {
      entityName = aliasMatch[1];
    }
  }
  const stretchParam = stretchParamMap.get(partName);
  const stretchCoeff = stretchParam
    ? calcStretchScalar(stretchParam, getStretchPositions(selectedStroke)!)
    : null;

  return {
    partName,
    entityName,
    coordString: `(${selectedStroke.value[3]},${selectedStroke.value[4]}) → (${selectedStroke.value[5]},${selectedStroke.value[6]})`,
    stretchCoeff,
  };
});

interface OtherInfo {
  isMultiple: boolean;
  coordString?: string;
}
const otherInfoSelector = createSelector([
  (state: AppState) => state.selection,
  (state: AppState) => state.selection.length ? state.glyph[state.selection[0]] : null,
], (selection, selectedStroke_): OtherInfo | null => {
  if (selection.length > 1) {
    return { isMultiple: true };
  }
  if (selection.length === 0) {
    return { isMultiple: false };
  }
  const selectedStroke = selectedStroke_!;
  const strokeType = selectedStroke.value[0];
  if (strokeTypes.includes(strokeType) || strokeType === 99) {
    return null;
  }

  const points = [];
  for (let i = 3; i + 2 <= selectedStroke.value.length; i += 2) {
    points.push(`(${selectedStroke.value[i]},${selectedStroke.value[i + 1]})`);
  }
  return { isMultiple: false, coordString: points.join(' → ') };
});

const selectIndexStringSelector = createSelector([
  (state: AppState) => state.glyph.length,
  (state: AppState) => state.selection,
], (glyphLength, selection) => {
  const selectedIndexString = selection
    .map((index) => index + 1)
    .sort((a, b) => a - b).join(',');
  return `${selectedIndexString || '-'} / ${glyphLength || '-'}`;
});

const buttonsDisabledSelector = createSelector([
  (state: AppState) => state.glyph.length,
  (state: AppState) => state.selection,
], (glyphLength, selection) => ({
  swapPrevDisabled: selection.length !== 1 || selection[0] === 0,
  swapNextDisabled: selection.length !== 1 || selection[0] === glyphLength - 1,
  selectPrevDisabled: glyphLength === 0,
  selectNextDisabled: glyphLength === 0,
}));

const SelectionInfo = () => {

  const strokeInfo = useSelector(strokeInfoSelector);
  const partInfo = useSelector(partInfoSelector);
  const otherInfo = useSelector(otherInfoSelector);

  const selectIndexString = useSelector(selectIndexStringSelector);

  const {
    swapPrevDisabled, swapNextDisabled,
    selectPrevDisabled, selectNextDisabled,
  } = useSelector(buttonsDisabledSelector, shallowEqual);

  const dispatch = useDispatch();
  const selectPrev = useCallback(() => {
    dispatch(selectActions.selectPrev());
  }, [dispatch]);
  const selectNext = useCallback(() => {
    dispatch(selectActions.selectNext());
  }, [dispatch]);
  const swapWithPrev = useCallback(() => {
    dispatch(editorActions.swapWithPrev());
  }, [dispatch]);
  const swapWithNext = useCallback(() => {
    dispatch(editorActions.swapWithNext());
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="select-control">
      <div className="selected-info">
        {strokeInfo && <>
          <div>
            {t('stroke type')}
            <select value={strokeInfo.strokeType}>
              {strokeTypes.map((strokeType) => (
                <option key={strokeType} value={strokeType}>
                  {t(`stroke type ${strokeType}`)}
                </option>
              ))}
            </select>
            <select value={strokeInfo.headShapeType}>
              {headShapeTypes[strokeInfo.strokeType].map((headShapeType) => (
                <option key={headShapeType} value={headShapeType}>
                  {t(`head type ${strokeInfo.strokeType}-${headShapeType}`)}
                </option>
              ))}
            </select>
            <select value={strokeInfo.tailShapeType}>
              {tailShapeTypes[strokeInfo.strokeType].map((tailShapeType) => (
                <option key={tailShapeType} value={tailShapeType}>
                  {t(`tail type ${strokeInfo.strokeType}-${tailShapeType}`)}
                </option>
              ))}
            </select>
          </div>
          <div>{strokeInfo.coordString}</div>
        </>}
        {partInfo && <>
          <div>
            {t('part')}
            {' '}
            <strong>{partInfo.partName}</strong>
            {' '}
            {partInfo.entityName && t('alias of', { entity: partInfo.entityName })}
          </div>
          <div>{partInfo.coordString}</div>
          {partInfo.stretchCoeff !== null && (
            <div>
              {t('stretch')}
              {' '}
              <input type="range" min={-10} max={10} value={partInfo.stretchCoeff} />
              {' '}
              {partInfo.stretchCoeff}
            </div>
          )}
        </>}
        {otherInfo && <>
          {otherInfo.isMultiple && <div>{t('selecting multiple strokes')}</div>}
          {otherInfo.coordString && <div>{otherInfo.coordString}</div>}
        </>}
      </div>
      <div className="selection-control">
        <button
          disabled={swapPrevDisabled}
          onClick={swapWithPrev}
        >
          {t('swap with prev')}
        </button>
        <button
          className="select-prevnext-button"
          disabled={selectPrevDisabled}
          onClick={selectPrev}
        >
          {t('select prev')}
        </button>
        <div className="selection-num">
          {selectIndexString}
        </div>
        <button
          className="select-prevnext-button"
          disabled={selectNextDisabled}
          onClick={selectNext}
        >
          {t('select next')}
        </button>
        <button
          disabled={swapNextDisabled}
          onClick={swapWithNext}
        >
          {t('swap with next')}
        </button>
      </div>
    </div>
  );
};

export default SelectionInfo;
