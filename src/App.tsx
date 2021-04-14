import React from 'react';
import { useSelector } from 'react-redux';

import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import PartsSearch from './components/PartsSearch'
import SubmitForm from './components/SubmitForm';
import OptionModal from './components/OptionModal';

import { AppState } from './reducers';

import { useShortcuts } from './shortcuts';

import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const areaSelectRect = useSelector((state: AppState) => state.areaSelectRect);
  const freehandStroke = useSelector((state: AppState) => state.freehandStroke);
  useShortcuts();
  return (
    <div className={'App' + (areaSelectRect || freehandStroke ? ' background-dragging' : '')} lang={i18n.language}>
      <GlyphArea />
      <EditorControls />
      <PartsSearch />
      <SubmitForm />
      <OptionModal />
    </div>
  );
}

export default App;
