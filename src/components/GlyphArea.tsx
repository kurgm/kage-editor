import React, { useEffect } from 'react';

import { EditorState } from '../reducers/editor';

import Glyph from './Glyph';
import AreaSelectRect from './AreaSelectRect';
import SelectionControl from '../containers/SelectionControl';

import { GlyphAreaActions } from '../containers/GlyphArea';
import './GlyphArea.css';

interface OwnProps {
}

type GlyphAreaProps = OwnProps & EditorState & GlyphAreaActions;

const GlyphArea = (props: GlyphAreaProps) => {
  const { handleMouseMove, handleMouseUp } = props;
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="glyph-area">
      <svg
        width="100%" height="100%" viewBox="-20 -20 500 240"
        onMouseDownCapture={props.handleMouseDownCapture}
        onMouseDown={props.handleMouseDownBackground}
      >
        {/* TODO: grid */}
        <rect x="0" y="0" width="200" height="200" className="glyph-boundary" />
        <rect x="12" y="12" width="176" height="176" className="glyph-guide" />
        <Glyph
          glyph={props.glyph}
          buhinMap={props.buhinMap}
          selection={props.selection}
          handleMouseDownDeselectedStroke={props.handleMouseDownDeselectedStroke}
          handleMouseDownSelectedStroke={props.handleMouseDownSelectedStroke}
        />
        <SelectionControl />
        <AreaSelectRect rect={props.areaSelectRect} />
      </svg>
    </div>
  );
};

export default GlyphArea;
