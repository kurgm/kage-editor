import React from 'react';
import './App.css';

import GlyphArea from './containers/GlyphArea';

function App() {
  return (
    <div className="App">
      <div className="glyph-area"><GlyphArea /></div>
      <div className="editor-controls">
      </div>
      <div className="parts-list-area" />
    </div>
  );
}

export default App;
