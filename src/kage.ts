import memoizeOne from 'memoize-one';

import { Kage, Polygons } from '@kurgm/kage-engine';
import { Glyph, unparseGlyphLine } from './kageUtils/glyph';

import store from './store';
import { editorActions } from './actions/editor';

import { getSource } from './callapi';

export const kage = new Kage();

let waiting = new Set<string>();

export const makeGlyphSeparated = memoizeOne((glyph: Glyph, map: Map<string, string>): Polygons[] => {
  const data = glyph.map(unparseGlyphLine);
  kage.kBuhin.search = (name) => {
    const result = map.get(name);
    if (typeof result === 'undefined') {
      if (!waiting.has(name)) {
        waiting.add(name);
        getSource(name)
          .then((source) => {
            store.dispatch(editorActions.addBuhin([name, source]));
            waiting.delete(name);
          });
      }
      return '';
    }
    return result;
  };
  const result = kage.makeGlyphSeparated(data);
  return result;
});
