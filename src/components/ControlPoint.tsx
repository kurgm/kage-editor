// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2025  kurgm

import clsx from 'clsx/lite';
import React from 'react';

import { MatchType } from '../kageUtils/match';

import styles from './ControlPoint.module.css';

interface ControlPointProps {
  x: number;
  y: number;
  matchType?: MatchType;
  cursorType?: 'nsResize' | 'ewResize' | 'nwseResize' | 'neswResize' | 'move';
  handleMouseDown: (evt: React.MouseEvent) => void;
}

const ControlPoint = (props: ControlPointProps) => (
  <rect
    x={props.x - 4}
    y={props.y - 4}
    width={8} height={8}
    className={
      clsx(
        styles.controlpointRect,
        props.matchType === MatchType.match && styles.match,
        props.matchType === MatchType.online && styles.online,
        styles[props.cursorType ?? 'move'],
      )
    }
    onMouseDown={props.handleMouseDown}
  />
);

export default ControlPoint;
