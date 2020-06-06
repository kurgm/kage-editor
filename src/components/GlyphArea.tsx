import React from 'react';

import { EditorState } from '../reducers/editor';

import Glyph from './Glyph';

import { GlyphAreaActions } from '../containers/GlyphArea';
import './GlyphArea.css';

interface OwnProps {
}

type GlyphAreaProps = OwnProps & EditorState & GlyphAreaActions;

const GlyphArea = (props: GlyphAreaProps) => (
  <div className="glyph-area">
    <svg width="100%" height="100%" viewBox="-20 -20 500 240">
      {/* TODO: grid */}
      <rect x="0" y="0" width="200" height="200" className="glyph-boundary" />
      <rect x="12" y="12" width="176" height="176" className="glyph-guide" />
      <Glyph
        glyph={props.glyph}
        selection={props.selection}
        selectSingle={props.selectSingle}
      />
      {/* TODO: control points */}
    </svg>
  </div>
);

export default GlyphArea;
