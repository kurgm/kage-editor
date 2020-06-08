import React from 'react';
import './App.css';

import GlyphArea from './containers/GlyphArea';
import EditorControls from './containers/EditorControls';

function App() {
  return (
    <div className="App">
      <GlyphArea />
      <EditorControls />
      <div className="parts-list-area" />
    </div>
  );
}

export default App;
