import React from 'react';

import { Glyph } from '../kageUtils';
import { makeGlyphSeparated } from '../kage';
import Stroke from './Stroke';

import './Glyph.css'

export interface GlyphComponentProps {
  glyph: Glyph;
  selection: number[];
  handleMouseDownStroke?: (evt: React.MouseEvent, index: number) => void;
}

const GlyphComponent = (props: GlyphComponentProps) => {
  const polygonsSep = makeGlyphSeparated(props.glyph);

  const { selection } = props;
  const nonSelection = polygonsSep.map((_polygons, index) => index)
    .filter((index) => !selection.includes(index));

  return (
    <>
      <g className="strokes-deselected">
        {nonSelection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownStroke?.(evt, index)}>
            <Stroke polygons={polygonsSep[index]} />
          </g>
        ))}
      </g>
      <g className="strokes-selected">
        {selection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownStroke?.(evt, index)}>
            <Stroke polygons={polygonsSep[index]} />
          </g>
        ))}
      </g>
    </>
  );
};

export default GlyphComponent;
