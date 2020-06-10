import React from 'react';

import { decomposeDeepGlyph } from '../kageUtils/decompose';
import { Glyph } from '../kageUtils/glyph';

import './StrokeCenterLine.css';

export interface StrokeCenterLineProps {
  glyph: Glyph;
  buhinMap: Map<string, string>;
}

const StrokeCenterLine = (props: StrokeCenterLineProps) => {
  const strokes = decomposeDeepGlyph(props.glyph, props.buhinMap);
  return (
    <g className="stroke-center-line">
      {strokes.map((stroke, index) => {
        const v = stroke.value;
        switch (v[0]) {
          case 1:
            return <path key={index} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]}`} />
          case 2:
            return <path key={index} d={`M ${v[3]} ${v[4]} Q ${v[5]} ${v[6]} ${v[7]} ${v[8]}`} />
          case 3:
          case 4:
            return <path key={index} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]} ${v[7]} ${v[8]}`} />
          case 6:
            return <path key={index} d={`M ${v[3]} ${v[4]} C ${v[5]} ${v[6]} ${v[7]} ${v[8]} ${v[9]} ${v[10]}`} />
          case 7:
            return <path key={index} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]} Q ${v[7]} ${v[8]} ${v[9]} ${v[10]}`} />
          default:
            return null;
        }
      })}
    </g>
  )
}

export default StrokeCenterLine;
