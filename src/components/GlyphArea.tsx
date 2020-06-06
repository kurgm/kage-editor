import React, { useEffect } from 'react';

import { EditorState } from '../reducers/editor';
import { CTMInv } from '../actions/editor';

import Glyph from './Glyph';

import { GlyphAreaActions } from '../containers/GlyphArea';
import './GlyphArea.css';

interface OwnProps {
}

type GlyphAreaProps = OwnProps & EditorState & GlyphAreaActions;

const GlyphArea = (props: GlyphAreaProps) => {
  const handleMouseDownCapture = (evt: React.MouseEvent) => {
    if (evt.target instanceof SVGSVGElement) {
      const ctm = evt.target.getScreenCTM();
      if (ctm) {
        const pt = evt.target.createSVGPoint();
        const ctmInv: CTMInv = (evtx, evty) => {
          pt.x = evtx;
          pt.y = evty;
          const { x, y } = pt.matrixTransform(ctm.inverse());
          return [x, y];
        };
        props.updateCTMInv(ctmInv);
      }
    }
  };
  const handleMouseDown = (evt: React.MouseEvent) => {
    if (!(evt.shiftKey || evt.ctrlKey)) {
      props.selectNone();
    }
    props.startAreaSelect(evt);
  };
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
        onMouseDownCapture={handleMouseDownCapture} onMouseDown={handleMouseDown}
      >
        {/* TODO: grid */}
        <rect x="0" y="0" width="200" height="200" className="glyph-boundary" />
        <rect x="12" y="12" width="176" height="176" className="glyph-guide" />
        <Glyph
          glyph={props.glyph}
          selection={props.selection}
          selectSingle={props.selectSingle}
          selectXorSingle={props.selectXorSingle}
          startSelectionDrag={props.startSelectionDrag}
        />
        {/* TODO: control points */}
      </svg>
    </div>
  );
};

export default GlyphArea;
