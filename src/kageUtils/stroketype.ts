import {GlyphLine, getNumColumns} from './glyph';

export const strokeTypes = [1, 2, 3, 4, 6, 7];

export const headShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 12, 22],
  2: [0, 32, 12, 22, 7],
  3: [0, 32, 12, 22],
  4: [0, 22],
  6: [0, 32, 12, 22, 7],
  7: [0, 32, 12, 22],
};

export const tailShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 13, 23, 4, 313, 413, 24],
  2: [7, 0, 8, 4, 5],
  3: [0, 5],
  4: [0, 5],
  6: [7, 0, 8, 4, 5],
  7: [7],
};

export const changeStrokeType = (glyphLine: GlyphLine, newType: number): GlyphLine => {
  const oldType = glyphLine.value[0];
  if (!strokeTypes.includes(oldType) || !strokeTypes.includes(newType)) {
    return glyphLine;
  }
  const newGlyphLine = {
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
