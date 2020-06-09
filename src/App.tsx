import React from 'react';
import './App.css';

import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import PartsSearch from './components/PartsSearch'
import { useShortcuts } from './shortcuts';

function App() {
  useShortcuts();
  return (
    <div className="App">
      <GlyphArea />
      <EditorControls />
      <PartsSearch />
    </div>
  );
}

export default App;
