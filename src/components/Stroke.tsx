// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023  kurgm

import { Polygons } from '@kurgm/kage-engine';

export interface StrokeComponentProps {
  polygons: Polygons;
  className?: string;
}

const StrokeComponent = (props: StrokeComponentProps) => (
  <>
    {props.polygons.array.map((polygon, i) => (
      <polygon
        key={i}
        className={props.className}
        points={polygon.array.map(({ x, y }) => `${x},${y} `).join("")}
      />
    ))}
  </>
);

export default StrokeComponent;
