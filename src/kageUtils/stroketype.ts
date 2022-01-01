import memoizeOne from 'memoize-one';

import { GlyphLine, getNumColumns } from './glyph';

export const strokeTypes = [1, 2, 3, 4, 6, 7];

export const headShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 12, 22],
  2: [0, 32, 12, 22, 7, 27],
  3: [0, 32, 12, 22],
  4: [0, 22],
  6: [0, 32, 12, 22, 7, 27],
  7: [0, 32, 12, 22],
};

export const tailShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 13, 23, 4, 313, 413, 24],
  2: [7, 0, 8, 4, 5],
  3: [0, 5, 32],
  4: [0, 5],
  6: [7, 0, 8, 4, 5],
  7: [7],
};

export const changeStrokeType = (glyphLine: GlyphLine, newType: number): GlyphLine => {
  const oldType = glyphLine.value[0];
  if (!strokeTypes.includes(oldType) || !strokeTypes.includes(newType)) {
    return glyphLine;
  }
  const newGlyphLine: GlyphLine = {
    value: glyphLine.value.slice(),
  };

  newGlyphLine.value[0] = newType;

  if (!headShapeTypes[newType].includes(newGlyphLine.value[1])) {
    newGlyphLine.value[1] = headShapeTypes[newType][0];
  }
  if (!tailShapeTypes[newType].includes(newGlyphLine.value[2])) {
    newGlyphLine.value[2] = tailShapeTypes[newType][0];
  }

  const oldNumPoints = (getNumColumns(oldType) - 3) / 2;
  const newNumPoints = (getNumColumns(newType) - 3) / 2;
  if (oldNumPoints === newNumPoints) {
    return newGlyphLine;
  }
  if (oldNumPoints === 2 && newNumPoints === 3) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const x3 = newGlyphLine.value[5];
    const y3 = newGlyphLine.value[6];

    const x2 = Math.round((x1 + x3) / 2);
    const y2 = Math.round((y1 + y3) / 2);
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2, x3, y3]
    );
    return newGlyphLine;
  }
  if (oldNumPoints === 2 && newNumPoints === 4) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const x4 = newGlyphLine.value[5];
    const y4 = newGlyphLine.value[6];

    const x2 = Math.round((2 * x1 + x4) / 3);
    const y2 = Math.round((2 * y1 + y4) / 3);
    const x3 = Math.round((x1 + 2 * x4) / 3);
    const y3 = Math.round((y1 + 2 * y4) / 3);
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2, x3, y3, x4, y4]
    );
    return newGlyphLine;
  }
  if (oldNumPoints === 3 && newNumPoints === 2) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const x2 = newGlyphLine.value[7];
    const y2 = newGlyphLine.value[8];
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2]
    );
    return newGlyphLine;
  }
  if (oldNumPoints === 3 && newNumPoints === 4) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const xm = newGlyphLine.value[5];
    const ym = newGlyphLine.value[6];
    const x4 = newGlyphLine.value[7];
    const y4 = newGlyphLine.value[8];

    const x2 = Math.round((x1 + 2 * xm) / 3);
    const y2 = Math.round((y1 + 2 * ym) / 3);
    const x3 = Math.round((x4 + 2 * xm) / 3);
    const y3 = Math.round((y4 + 2 * ym) / 3);
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2, x3, y3, x4, y4]
    );
    return newGlyphLine;
  }
  if (oldNumPoints === 4 && newNumPoints === 2) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const x2 = newGlyphLine.value[9];
    const y2 = newGlyphLine.value[10];
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2]
    );
    return newGlyphLine;
  }
  if (oldNumPoints === 4 && newNumPoints === 3) {
    const x1 = newGlyphLine.value[3];
    const y1 = newGlyphLine.value[4];
    const xm1 = newGlyphLine.value[5];
    const ym1 = newGlyphLine.value[6];
    const xm2 = newGlyphLine.value[7];
    const ym2 = newGlyphLine.value[8];
    const x3 = newGlyphLine.value[9];
    const y3 = newGlyphLine.value[10];

    const x2 = Math.round((xm1 + xm2) / 2);
    const y2 = Math.round((ym1 + ym2) / 2);
    newGlyphLine.value = newGlyphLine.value.slice(0, 3).concat(
      [x1, y1, x2, y2, x3, y3]
    );
    return newGlyphLine;
  }
  return newGlyphLine;
};

const validStrokeShapeTypes: [number, number, number][] = [
  [1, 0, 0],
  [1, 0, 2],
  [1, 0, 32],
  [1, 0, 13],
  [1, 0, 23],
  [1, 0, 4],
  [1, 0, 313],
  [1, 0, 413],
  [1, 0, 24],
  [1, 2, 0],
  [1, 2, 2],
  [1, 32, 0],
  [1, 32, 32],
  [1, 32, 13],
  [1, 32, 23],
  [1, 32, 4],
  [1, 32, 313],
  [1, 32, 413],
  [1, 32, 24],
  [1, 12, 0],
  [1, 12, 32],
  [1, 12, 13],
  [1, 12, 23],
  [1, 12, 313],
  [1, 12, 413],
  [1, 12, 24],
  [1, 22, 0],
  [1, 22, 32],
  [1, 22, 13],
  [1, 22, 23],
  [1, 22, 4],
  [1, 22, 313],
  [1, 22, 413],
  [1, 22, 24],
  [2, 0, 7],
  [2, 0, 5],
  [2, 32, 7],
  [2, 32, 4],
  [2, 32, 5],
  [2, 12, 7],
  [2, 22, 7],
  [2, 22, 4],
  [2, 22, 5],
  [2, 7, 0],
  [2, 7, 8],
  [2, 7, 4],
  [2, 27, 0],
  [3, 0, 0],
  [3, 0, 5],
  [3, 0, 32],
  [3, 32, 0],
  [3, 32, 5],
  [3, 32, 32],
  [3, 12, 0],
  [3, 12, 5],
  [3, 12, 32],
  [3, 22, 0],
  [3, 22, 5],
  [3, 22, 32],
  [4, 0, 0],
  [4, 0, 5],
  [4, 22, 0],
  [4, 22, 5],
  [6, 0, 7],
  [6, 0, 5],
  [6, 32, 7],
  [6, 32, 4],
  [6, 32, 5],
  [6, 12, 7],
  [6, 22, 7],
  [6, 22, 4],
  [6, 22, 5],
  [6, 7, 0],
  [6, 7, 8],
  [6, 7, 4],
  [6, 27, 0],
  [7, 0, 7],
  [7, 32, 7],
  [7, 12, 7],
  [7, 22, 7],
];

export const isValidStrokeShapeTypes = memoizeOne((stroke: GlyphLine) => {
  if (!strokeTypes.includes(stroke.value[0])) {
    return true;
  }

  if (!validStrokeShapeTypes.some(([s0, s1, s2]) => (
    s0 === stroke.value[0] &&
    s1 === stroke.value[1] &&
    s2 === stroke.value[2]
  ))) {
    return false;
  }

  if (stroke.value[0] === 1) {
    const [, s1, s2, x1, y1, x2, y2] = stroke.value;
    const isVertical = y1 === y2 ? x1 === x2 : x2 - x1 <= Math.abs(y1 - y2);

    if (isVertical
      ? (s1 === 2 || s2 === 2)
      : !([0, 2].includes(s1) && [0, 2].includes(s2))
    ) {
      return false;
    }
  }

  return true;
});
