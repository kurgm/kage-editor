// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020  kurgm

import clsx from 'clsx/lite';
import React from 'react';

import './ControlPoint.css';

interface ControlPointProps {
  x: number;
  y: number;
  className?: string;
  handleMouseDown: (evt: React.MouseEvent) => void;
}

const ControlPoint = (props: ControlPointProps) => (
  <rect
    x={props.x - 4}
    y={props.y - 4}
    width={8} height={8}
    className={clsx('controlpoint-rect', props.className)}
    onMouseDown={props.handleMouseDown}
  />
);

export default ControlPoint;
