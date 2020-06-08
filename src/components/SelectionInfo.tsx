import React from 'react';

import { useTranslation } from 'react-i18next';

import { SelectionInfoType, SelectionInfoState, SelectionInfoActions } from "../containers/SelectionInfo";
import './SelectionInfo.css'

interface OwnProps {
}

type SelectionInfoProps = OwnProps & SelectionInfoState & SelectionInfoActions;

const SelectionInfo = (props: SelectionInfoProps) => {
  const { t } = useTranslation();
  return (
    <div className="select-control">
      <div className="selected-info">
        {props.infoType === SelectionInfoType.stroke && (
          <div>
            {t('stroke type')}
            <select value={props.selectedGlyphLine!.value[0]}>
              {[1, 2, 3, 4, 6, 7].map((strokeType) => (
                <option key={strokeType} value={strokeType}>{t(`stroke type ${strokeType}`)}</option>
              ))}
            </select>
            {/* TODO: 頭形状，尾形状 */}
          </div>
        )}
        {props.infoType === SelectionInfoType.part && (
          <div>
            {t('part')}
            {' '}
            <strong>{props.selectedGlyphLine!.partName!}</strong>
            {' '}
            {props.entityName && t('alias of', { entity: props.entityName })}
          </div>
        )}
        <div>{props.summary}</div>
        {props.infoType === SelectionInfoType.part && typeof props.stretchCoeff === 'number' && (
          <div>
            {t('stretch')}
            {' '}
            <input type="range" min={-10} max={10} value={props.stretchCoeff} />
            {' '}
            {props.stretchCoeff}
          </div>
        )}
      </div>
      <div className="selection-control">
        <button
          disabled={props.swapPrevDisabled}
          onClick={props.swapWithPrev}
        >
          {t('swap with prev')}
        </button>
        <button
          className="select-prevnext-button"
          disabled={props.selectPrevDisabled}
          onClick={props.selectPrev}
        >
          {t('select prev')}
        </button>
        <div className="selection-num">
          {props.selectIndexString}
        </div>
        <button
          className="select-prevnext-button"
          disabled={props.selectNextDisabled}
          onClick={props.selectNext}
        >
          {t('select next')}
        </button>
        <button
          disabled={props.swapNextDisabled}
          onClick={props.swapWithNext}
        >
          {t('swap with next')}
        </button>
      </div>
    </div>
  );
};

export default SelectionInfo;
