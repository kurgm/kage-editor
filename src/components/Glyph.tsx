import React, { useMemo } from 'react';

import { Kage, Polygons } from '@kurgm/kage-engine';

import { Glyph, unparseGlyphLine } from '../kageUtils';
import Stroke from './Stroke';

import './Glyph.css'

export interface GlyphComponentProps {
  glyph: Glyph;
  selection: number[];
}

const kage = new Kage();

type IndexedPolygons = {
  polygons: Polygons;
  index: number;
}

const GlyphComponent = (props: GlyphComponentProps) => {
  const polygonsSep = useMemo(() => {
    const data = props.glyph.map(unparseGlyphLine);
    return kage.makeGlyphSeparated(data);
  }, [props.glyph]);

  const deselected: IndexedPolygons[] = [];
  const selected: IndexedPolygons[] = [];

  polygonsSep.forEach((polygons, index) => {
    if (props.selection.includes(index)) {
      selected.push({ polygons, index });
    } else {
      deselected.push({ polygons, index });
    }
  });

  return (
    <>
      <g className="strokes-deselected">
        {deselected
          .map(({ polygons, index }) => <Stroke polygons={polygons} key={index} />)
        }
      </g>
      <g className="strokes-selected">
        {selected
          .map(({ polygons, index }) => <Stroke polygons={polygons} key={index} />)
        }
      </g>
    </>
  );
};

export default GlyphComponent;
