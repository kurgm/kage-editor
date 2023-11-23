import { createSelector } from '@reduxjs/toolkit';

import { Glyph } from '../kageUtils/glyph';
import { getGlyphLineBBX } from '../kageUtils/bbx';

import { draggedGlyphSelector } from './draggedGlyph';

export const submitGlyphSelector = createSelector([
  draggedGlyphSelector,
], (glyph: Glyph): Glyph => {
  return glyph.filter((glyphLine) => getGlyphLineBBX(glyphLine)[0] < 200);
});
