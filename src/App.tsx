import React from 'react';
import './App.css';

import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import { useShortcuts } from './shortcuts';

function App() {
  useShortcuts();
  return (
    <div className="App">
      <GlyphArea />
      <EditorControls />
      <div className="parts-list-area" />
    </div>
  );
}

export default App;
