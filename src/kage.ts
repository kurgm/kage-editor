import memoizeOne from 'memoize-one';

import { Kage, Polygons } from '@kurgm/kage-engine';
import { Glyph, unparseGlyphLine } from './kageUtils';

export const kage = new Kage();

export const makeGlyphSeparated = memoizeOne((glyph: Glyph): Polygons[] => {
  const data = glyph.map(unparseGlyphLine);
  const result = kage.makeGlyphSeparated(data);
  return result;
});
