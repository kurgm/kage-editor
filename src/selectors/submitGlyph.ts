import { Glyph } from '../kageUtils/glyph';
import { getGlyphLineBBX } from '../kageUtils/bbx';

import { draggedGlyphSelector } from './draggedGlyph';
import { createAppSelector } from './util';

export const submitGlyphSelector = createAppSelector([
  draggedGlyphSelector,
], (glyph: Glyph): Glyph => {
  return glyph.filter((glyphLine) => getGlyphLineBBX(glyphLine)[0] < 200);
});
