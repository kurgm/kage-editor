import { Kage, Polygons } from '@kurgm/kage-engine';
import { Glyph, unparseGlyphLine } from './kageUtils';

export const kage = new Kage();

let cached: {
  glyph: Glyph;
  result: Polygons[];
} | null = null;

export const makeGlyphSeparated = (glyph: Glyph): Polygons[] => {
  if (glyph === cached?.glyph) {
    return cached.result;
  }
  const data = glyph.map(unparseGlyphLine);
  const result = kage.makeGlyphSeparated(data);
  cached = { glyph, result };
  return result;
};
