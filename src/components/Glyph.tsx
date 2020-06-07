import React from 'react';

import { Glyph } from '../kageUtils/glyph';
import { makeGlyphSeparated } from '../kage';
import Stroke from './Stroke';

import './Glyph.css'

export interface GlyphComponentProps {
  glyph: Glyph;
  buhinMap: Map<string, string>;
  selection: number[];
  handleMouseDownDeselectedStroke?: (evt: React.MouseEvent, index: number) => void;
  handleMouseDownSelectedStroke?: (evt: React.MouseEvent, index: number) => void;
}

const GlyphComponent = (props: GlyphComponentProps) => {
  const polygonsSep = makeGlyphSeparated(props.glyph, props.buhinMap);

  const { selection } = props;
  const nonSelection = polygonsSep.map((_polygons, index) => index)
    .filter((index) => !selection.includes(index));

  return (
    <>
      <g className="strokes-deselected">
        {nonSelection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownDeselectedStroke?.(evt, index)}>
            <Stroke polygons={polygonsSep[index]} />
          </g>
        ))}
      </g>
      <g className="strokes-selected">
        {selection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownSelectedStroke?.(evt, index)}>
            <Stroke polygons={polygonsSep[index]} />
          </g>
        ))}
      </g>
    </>
  );
};

export default GlyphComponent;
