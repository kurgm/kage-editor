// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import { useTranslation } from 'react-i18next';

import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import PartsSearch from './components/PartsSearch'
import SubmitForm from './components/SubmitForm';
import OptionModal from './components/OptionModal';

import { useShortcuts } from './shortcuts';

import styles from './App.module.css';

function App() {
  const { i18n } = useTranslation();
  useShortcuts();
  return (
    <div className={styles.App} lang={i18n.language}>
      <GlyphArea className={styles.glyphArea} />
      <EditorControls className={styles.editorControls} />
      <PartsSearch className={styles.partsSearchArea} />
      <SubmitForm />
      <OptionModal />
    </div>
  );
}

export default App;
