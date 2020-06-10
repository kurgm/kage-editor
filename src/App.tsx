import React from 'react';
import './App.css';

import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import PartsSearch from './components/PartsSearch'
import SubmitForm from './components/SubmitForm';
import OptionModal from './components/OptionModal';

import { useShortcuts } from './shortcuts';

function App() {
  useShortcuts();
  return (
    <div className="App">
      <GlyphArea />
      <EditorControls />
      <PartsSearch />
      <SubmitForm />
      <OptionModal />
    </div>
  );
}

export default App;
