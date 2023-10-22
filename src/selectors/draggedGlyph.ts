import { createSelector } from '@reduxjs/toolkit';

import { RectPointPosition } from '../actions/drag';

import { AppState } from '../reducers';

import { Glyph, GlyphLine } from '../kageUtils/glyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { moveSelectedGlyphLines, moveSelectedPoint, resizeSelectedGlyphLines } from '../kageUtils/transform';
import { drawFreehand } from '../kageUtils/freehand';

export const resizeSelected = (glyph: Glyph, selection: number[], position: RectPointPosition, dx: number, dy: number): Glyph => {
  if (selection.length === 1) {
    const selectedGlyphLine = glyph[selection[0]];
    switch (selectedGlyphLine.value[0]) {
      case 0:
      case 9:
      case 99: {
        const newValue = selectedGlyphLine.value.slice();
        switch (position) {
          case RectPointPosition.north:
            newValue[4] = Math.round(newValue[4] + dy);
            break;
          case RectPointPosition.west:
            newValue[3] = Math.round(newValue[3] + dx);
            break;
          case RectPointPosition.south:
            newValue[6] = Math.round(newValue[6] + dy);
            break;
          case RectPointPosition.east:
            newValue[5] = Math.round(newValue[5] + dx);
            break;
          case RectPointPosition.southeast:
            newValue[5] = Math.round(newValue[5] + dx);
            newValue[6] = Math.round(newValue[6] + dy);
            break;
          case RectPointPosition.southwest:
            newValue[3] = Math.round(newValue[3] + dx);
            newValue[6] = Math.round(newValue[6] + dy);
            break;
          case RectPointPosition.northeast:
            newValue[5] = Math.round(newValue[5] + dx);
            newValue[4] = Math.round(newValue[4] + dy);
            break;
          case RectPointPosition.northwest:
            newValue[3] = Math.round(newValue[3] + dx);
            newValue[4] = Math.round(newValue[4] + dy);
            break;
          default:
            // exhaustive?
            ((_x: never) => { })(position);
        }
        const newGlyphLine: GlyphLine = selectedGlyphLine.value[0] === 99
          ? { value: newValue, partName: selectedGlyphLine.partName }
          : { value: newValue };
        return glyph.map((glyphLine, index) => index === selection[0] ? newGlyphLine : glyphLine);
      }
    }
  }
  const minSize = 20;
  const oldBBX = getGlyphLinesBBX(selection.map((index) => glyph[index]));
  const newBBX = oldBBX.slice() as typeof oldBBX;
  switch (position) {
    case RectPointPosition.north:
      newBBX[1] = Math.min(newBBX[1] + dy, newBBX[3] - minSize);
      break;
    case RectPointPosition.west:
      newBBX[0] = Math.min(newBBX[0] + dx, newBBX[2] - minSize);
      break;
    case RectPointPosition.south:
      newBBX[3] = Math.max(newBBX[3] + dy, newBBX[1] + minSize);
      break;
    case RectPointPosition.east:
      newBBX[2] = Math.max(newBBX[2] + dx, newBBX[0] + minSize);
      break;
    case RectPointPosition.southeast:
      newBBX[2] = Math.max(newBBX[2] + dx, newBBX[0] + minSize);
      newBBX[3] = Math.max(newBBX[3] + dy, newBBX[1] + minSize);
      break;
    case RectPointPosition.southwest:
      newBBX[0] = Math.min(newBBX[0] + dx, newBBX[2] - minSize);
      newBBX[3] = Math.max(newBBX[3] + dy, newBBX[1] + minSize);
      break;
    case RectPointPosition.northeast:
      newBBX[2] = Math.max(newBBX[2] + dx, newBBX[0] + minSize);
      newBBX[1] = Math.min(newBBX[1] + dy, newBBX[3] - minSize);
      break;
    case RectPointPosition.northwest:
      newBBX[0] = Math.min(newBBX[0] + dx, newBBX[2] - minSize);
      newBBX[1] = Math.min(newBBX[1] + dy, newBBX[3] - minSize);
      break;
    default:
      // exhaustive?
      ((_x: never) => { })(position);
  }
  return resizeSelectedGlyphLines(glyph, selection, oldBBX, newBBX);
};

export const draggedGlyphSelector = createSelector([
  (state: AppState) => state.glyph,
  (state: AppState) => state.selection,
  (state: AppState) => state.dragSelection,
  (state: AppState) => state.dragPoint,
  (state: AppState) => state.resizeSelection,
  (state: AppState) => state.freehandStroke,
], (glyph, selection, dragSelection, dragPoint, resizeSelection, freehandStroke) => {
  if (dragSelection) {
    const [x1, y1, x2, y2] = dragSelection;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = moveSelectedGlyphLines(glyph, selection, dx, dy);
  } else if (dragPoint) {
    const [pointIndex, [x1, y1, x2, y2]] = dragPoint;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = moveSelectedPoint(glyph, selection, pointIndex, dx, dy);
  } else if (resizeSelection) {
    const [position, [x1, y1, x2, y2]] = resizeSelection;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = resizeSelected(glyph, selection, position, dx, dy);
  } else if (freehandStroke) {
    glyph = drawFreehand(glyph, freehandStroke);
  }
  return glyph;
});
