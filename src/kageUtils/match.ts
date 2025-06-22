// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2025  kurgm

import { Glyph, PointDescriptor, getNumColumns } from './glyph';

export enum MatchType {
  none,
  online,
  match,
}

export const getMatchType = (glyph: Glyph, point: PointDescriptor): MatchType => {
  const glyphLine = glyph[point.lineIndex];

  const endPointIndex = (getNumColumns(glyphLine.value[0]) - 3) / 2 - 1;
  if (point.pointIndex !== 0 && point.pointIndex !== endPointIndex) {
    return MatchType.none;
  }

  const x = glyphLine.value[3 + point.pointIndex * 2];
  const y = glyphLine.value[3 + point.pointIndex * 2 + 1];
  const isOnline = (x1: number, y1: number, x2: number, y2: number): boolean => (
    (
      x1 === x2 && // 垂直
      x1 === x && y1 <= y && y <= y2
    ) || (
      y1 === y2 && // 水平
      y1 === y && x1 <= x && x <= x2
    )
  );

  let result = MatchType.none;
  for (let lineIndex = 0; lineIndex < glyph.length; lineIndex++) {
    if (point.lineIndex === lineIndex) {
      continue;
    }
    const glyphLine = glyph[lineIndex];
    if ([0, 9, 99].includes(glyphLine.value[0])) {
      continue;
    }

    if (glyphLine.value[3] === x && glyphLine.value[4] === y) {
      return MatchType.match;
    }
    const endPointIndex = (getNumColumns(glyphLine.value[0]) - 3) / 2 - 1;
    if (
      glyphLine.value[3 + endPointIndex * 2] === x &&
      glyphLine.value[3 + endPointIndex * 2 + 1] === y
    ) {
      return MatchType.match;
    }

    switch (glyphLine.value[0]) {
      case 3:
      case 4:
        if (
          isOnline(glyphLine.value[3], glyphLine.value[4], glyphLine.value[5], glyphLine.value[6]) ||
          isOnline(glyphLine.value[5], glyphLine.value[6], glyphLine.value[7], glyphLine.value[8])
        ) {
          result = MatchType.online;
        }
        break;
      case 1:
      case 7:
        if (isOnline(glyphLine.value[3], glyphLine.value[4], glyphLine.value[5], glyphLine.value[6])) {
          result = MatchType.online;
        }
        break;
      default:
        break;
    }
  }
  return result;
};
