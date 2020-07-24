import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';

import { displayActions } from '../actions/display';
import { AppState } from '../reducers';
import { KShotai } from '../kage';
import { XorMaskType, xorMaskTypes } from '../xorMask';

import './OptionModal.css';

const OptionModal = () => {
  const showOptionModal = useSelector((state: AppState) => state.showOptionModal);
  const grid = useSelector((state: AppState) => state.grid);
  const shotai = useSelector((state: AppState) => state.shotai);
  const xorMaskType = useSelector((state: AppState) => state.xorMaskType);
  const showStrokeCenterLine = useSelector((state: AppState) => state.showStrokeCenterLine);

  const dispatch = useDispatch();
  const handleRequestClose = useCallback(() => {
    dispatch(displayActions.closeOptionModal());
  }, [dispatch]);

  const handleGridDisplayChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setGridDisplay(evt.currentTarget.checked));
  }, [dispatch]);
  const handleGridOriginXChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setGridOriginX(evt.currentTarget.valueAsNumber));
  }, [dispatch]);
  const handleGridOriginYChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setGridOriginY(evt.currentTarget.valueAsNumber));
  }, [dispatch]);
  const handleGridSpacingXChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setGridSpacingX(evt.currentTarget.valueAsNumber));
  }, [dispatch]);
  const handleGridSpacingYChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setGridSpacingY(evt.currentTarget.valueAsNumber));
  }, [dispatch]);
  const handleShotaiChange = useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(displayActions.setShotai(+evt.currentTarget.value as KShotai));
  }, [dispatch]);
  const handleStrokeCenterLineChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(displayActions.setStrokeCenterLineDisplay(evt.currentTarget.checked));
  }, [dispatch]);
  const handleXorMaskTypeChange = useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(displayActions.setXorMaskType(evt.currentTarget.value as XorMaskType));
  }, [dispatch]);
  
  const { t, i18n } = useTranslation();
  const handleLanguageChange = useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(evt.currentTarget.value);
  }, [i18n]);

  return (
    <ReactModal
      isOpen={showOptionModal}
      onRequestClose={handleRequestClose}
      shouldCloseOnEsc={false} // handled by hotkeys-js
      className={'modal-content'}
    >
      <fieldset>
        <legend>{t('grid option')}</legend>
        <div>
          <label>
            <input type="checkbox" checked={grid.display} onChange={handleGridDisplayChange} />
            {t('enable grid')}
          </label>
        </div>
        <div>
          {t('grid origin x')} <input
            type="number"
            value={grid.originX}
            min={0}
            max={200}
            onChange={handleGridOriginXChange}
            disabled={!grid.display}
          />
          {' '}
          {t('grid origin y')} <input
            type="number"
            value={grid.originY}
            min={0}
            max={200}
            onChange={handleGridOriginYChange}
            disabled={!grid.display}
          />
        </div>
        <div>
          {t('grid spacing x')} <input
            type="number"
            value={grid.spacingX}
            min={2}
            max={200}
            onChange={handleGridSpacingXChange}
            disabled={!grid.display}
          />
          {' '}
          {t('grid spacing y')} <input
            type="number"
            value={grid.spacingY}
            min={2}
            max={200}
            onChange={handleGridSpacingYChange}
            disabled={!grid.display}
          />
        </div>
      </fieldset>
      <div>
        {t('glyph font style')} <select
          value={shotai}
          onChange={handleShotaiChange}
        >
          <option value={0}>{t('mincho style')}</option>
          <option value={1}>{t('gothic style')}</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showStrokeCenterLine}
            onChange={handleStrokeCenterLineChange}
          />
          {t('show stroke center line')}
        </label>
      </div>
      <div>
        {t('negative mask type')} <select
          value={xorMaskType}
          onChange={handleXorMaskTypeChange}
        >
          {xorMaskTypes.map((maskType) => (
            <option value={maskType}>{t(`negative mask type ${maskType}`)}</option>
          ))}
        </select>
      </div>
      <div>
        {t('display language')} <select
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="ko" disabled>한국어</option>
          <option value="zh-Hans">简体中文</option>
          <option value="zh-Hant">繁體中文</option>
        </select>
      </div>
      <div>
        <button onClick={handleRequestClose}>{t('close modal')}</button>
      </div>
    </ReactModal>
  )
};

if (process.env.NODE_ENV !== 'test') {
  ReactModal.setAppElement('#root');
}

export default OptionModal;
