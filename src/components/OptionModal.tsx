// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2021, 2023, 2025  kurgm, hulenkius and graphemecluster

import React, { useCallback } from 'react';

import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';

import { displayActions, ShowCenterLine } from '../actions/display';
import { useAppDispatch, useAppSelector } from '../hooks';
import { KShotai } from '../kage';
import { XorMaskType, xorMaskTypes } from '../xorMask';

import styles from './OptionModal.module.css';

const OptionModal = () => {
  const showOptionModal = useAppSelector((state) => state.showOptionModal);
  const grid = useAppSelector((state) => state.grid);
  const shotai = useAppSelector((state) => state.shotai);
  const xorMaskType = useAppSelector((state) => state.xorMaskType);
  const showStrokeCenterLine = useAppSelector((state) => state.showStrokeCenterLine);

  const dispatch = useAppDispatch();
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
  const handleStrokeCenterLineChange = useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(displayActions.setStrokeCenterLineDisplay(+evt.currentTarget.value as ShowCenterLine));
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
      className={styles.modalContent}
    >
      <fieldset>
        <legend>{t('grid option')}</legend>
        <div>
          <label>
            <input type="checkbox" checked={grid.display} onChange={handleGridDisplayChange} />
            {t('enable grid')}
          </label>
        </div>
        <div className={styles.gridOption}>
          <div>{t('grid origin x')}</div>
          <input
            type="number"
            value={grid.originX}
            min={0}
            max={200}
            onChange={handleGridOriginXChange}
            disabled={!grid.display}
          />

          <div>{t('grid origin y')}</div>
          <input
            type="number"
            value={grid.originY}
            min={0}
            max={200}
            onChange={handleGridOriginYChange}
            disabled={!grid.display}
          />

          <div>{t('grid spacing x')}</div>
          <input
            type="number"
            value={grid.spacingX}
            min={2}
            max={200}
            onChange={handleGridSpacingXChange}
            disabled={!grid.display}
          />

          <div>{t('grid spacing y')}</div>
          <input
            type="number"
            value={grid.spacingY}
            min={2}
            max={200}
            onChange={handleGridSpacingYChange}
            disabled={!grid.display}
          />
        </div>
      </fieldset>
      <div className={styles.generalOption}>
        <div>{t('glyph font style')}</div>
        <select
          value={shotai}
          onChange={handleShotaiChange}
        >
          <option value={KShotai.kMincho}>{t('mincho style')}</option>
          <option value={KShotai.kGothic}>{t('gothic style')}</option>
        </select>

        <div>{t('show stroke center line')}</div>
        <select
          value={showStrokeCenterLine}
          onChange={handleStrokeCenterLineChange}
        >
          <option value={ShowCenterLine.none}>{t('show stroke center line none')}</option>
          <option value={ShowCenterLine.selection}>{t('show stroke center line selection')}</option>
          <option value={ShowCenterLine.always}>{t('show stroke center line always')}</option>
        </select>

        <div>{t('negative mask type')}</div>
        <select
          value={xorMaskType}
          onChange={handleXorMaskTypeChange}
        >
          {xorMaskTypes.map((maskType) => (
            <option key={maskType} value={maskType}>{t(`negative mask type ${maskType}`)}</option>
          ))}
        </select>

        <div>{t('display language')}</div>
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="ko">한국어</option>
          <option value="zh-Hans">简体中文</option>
          <option value="zh-Hant">繁體中文</option>
        </select>
      </div>
      <div className={styles.closeOption}>
        <button onClick={handleRequestClose}>{t('close modal')}</button>
      </div>
    </ReactModal>
  )
};

if (process.env.NODE_ENV !== 'test') {
  ReactModal.setAppElement('#root');
}

export default OptionModal;
