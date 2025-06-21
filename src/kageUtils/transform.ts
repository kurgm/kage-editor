// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020  kurgm

import { GlyphLine, Glyph, PointDescriptor } from './glyph';

import { BBX } from './bbx';
import { listupConnectedPoints, listupConnectedPointsOfSelection } from './connection';

export const applyGlyphLineOperation = (glyphLine: GlyphLine, tX: (x: number) => number, tY: (y: number) => number): GlyphLine => {
  switch (glyphLine.value[0]) {
    case 99: {
      const value = glyphLine.value.slice();
      value[3] = tX(value[3]);
      value[4] = tY(value[4]);
      value[5] = tX(value[5]);
      value[6] = tY(value[6]);
      return { value, partName: glyphLine.partName };
    }
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 9: {
      const value = glyphLine.value.slice();
      for (let i = 3; i + 2 <= value.length; i += 2) {
        value[i] = tX(value[i]);
        value[i + 1] = tY(value[i + 1]);
      }
      return { value };
    }
    default:
      return glyphLine;
  }
}

export const applyGlyphPointOperation = (glyph: Glyph, pdescs: PointDescriptor[], tX: (x: number) => number, tY: (y: number) => number): Glyph => {
  if (pdescs.length === 0) {
    return glyph;
  }
  const newGlyph = glyph.slice();
  for (const { lineIndex, pointIndex } of pdescs) {
    const glyphLine = newGlyph[lineIndex];
    const newValue = glyphLine.value.slice();
    newValue[3 + pointIndex * 2] = tX(newValue[3 + pointIndex * 2]);
    newValue[3 + pointIndex * 2 + 1] = tY(newValue[3 + pointIndex * 2 + 1]);
    newGlyph[lineIndex] = {
      ...glyphLine,
      value: newValue,
    };
  }
  return newGlyph;
};


export const moveSelectedGlyphLines = (glyph: Glyph, selection: number[], dx: number, dy: number): Glyph => {
  if (selection.length === 0) {
    return glyph;
  }
  const targetDescs = listupConnectedPointsOfSelection(glyph, selection);

  const tX = (x: number) => Math.round(x + dx);
  const tY = (y: number) => Math.round(y + dy);
  glyph = glyph.map((glyphLine, index) => selection.includes(index)
    ? applyGlyphLineOperation(glyphLine, tX, tY)
    : glyphLine
  );
  glyph = applyGlyphPointOperation(glyph, targetDescs, tX, tY);
  return glyph;
};

export const moveSelectedPoint = (glyph: Glyph, selection: number[], pointIndex: number, dx: number, dy: number): Glyph => {
  if (selection.length === 0) {
    return glyph;
  }
  const lineIndex = selection[0];
  const selectedDesc: PointDescriptor = { lineIndex, pointIndex };
  const targetDescs = listupConnectedPoints(glyph, [selectedDesc])
    .filter((targetDesc) => targetDesc.lineIndex !== lineIndex);
  targetDescs.push(selectedDesc);

  const tX = (x: number) => Math.round(x + dx);
  const tY = (y: number) => Math.round(y + dy);
  glyph = applyGlyphPointOperation(glyph, targetDescs, tX, tY);
  return glyph;
};

export const resizeGlyphLine = (glyphLine: GlyphLine, oldBBX: BBX, newBBX: BBX): GlyphLine => {
  const [x11, y11, x12, y12] = oldBBX;
  const [x21, y21, x22, y22] = newBBX;
  const tX = (x: number) => Math.round(x21 + (x - x11) * (x22 - x21) / (x12 - x11));
  const tY = (y: number) => Math.round(y21 + (y - y11) * (y22 - y21) / (y12 - y11));
  return applyGlyphLineOperation(glyphLine, tX, tY);
};

export const resizeSelectedGlyphLines = (glyph: Glyph, selection: number[], oldBBX: BBX, newBBX: BBX): Glyph => {
  return glyph.map((glyphLine, index) => selection.includes(index)
    ? resizeGlyphLine(glyphLine, oldBBX, newBBX)
    : glyphLine
  );
};
