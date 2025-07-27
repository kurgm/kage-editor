// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import styles from './AreaSelectRect.module.css';

interface AreaSelectRectProps {
  rect: [number, number, number, number] | null;
}

const AreaSelectRect = (props: AreaSelectRectProps) => {
  if (!props.rect) {
    return null;
  }
  let [x1, y1, x2, y2] = props.rect;
  if (x1 > x2) {
    // swap
    const temp = x1;
    x1 = x2;
    x2 = temp;
  }
  if (y1 > y2) {
    // swap
    const temp = y1;
    y1 = y2;
    y2 = temp;
  }

  return <rect className={styles.areaSelectRect} x={x1} y={y1} width={x2 - x1} height={y2 - y1} />;
};

export default AreaSelectRect;
