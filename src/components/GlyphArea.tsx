import React from 'react';

import { EditorState } from '../reducers/editor';
import { GlyphAreaActions } from '../containers/GlyphArea';

interface OwnProps {
}

type GlyphAreaProps = OwnProps & EditorState & GlyphAreaActions;

const GlyphArea = (props: GlyphAreaProps) => (
  <div>
    glyph area
  </div>
)

export default GlyphArea;
