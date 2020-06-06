import React from 'react';

import { Polygons } from '@kurgm/kage-engine';

export interface StrokeComponentProps {
  polygons: Polygons;
}

const StrokeComponent = (props: StrokeComponentProps) => (
  <>
    {props.polygons.array.map((polygon, i) => (
      <polygon key={i} points={polygon.array.map(({ x, y }) => `${x},${y} `).join("")} />
    ))}
  </>
);

export default StrokeComponent;
