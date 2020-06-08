import memoizeOne from 'memoize-one';

import { Kage, Polygons } from '@kurgm/kage-engine';
import { Glyph, unparseGlyphLine } from './kageUtils/glyph';
import { StretchParam } from './kageUtils/stretchparam';

import store from './store';
import { editorActions } from './actions/editor';

import { getSource } from './callapi';

export const kage = new Kage();

let waiting = new Set<string>();
const loadAbsentBuhin = (name: string) => {
  if (waiting.has(name)) {
    return;
  }
  waiting.add(name);
  getSource(name)
    .then((source) => {
      if (typeof source !== 'string') {
        throw new Error(`failed to get buhin source of ${name}`);
      }
      const stretchMatch = /^0:1:0:(-?\d+):(-?\d+):(-?\d+):(-?\d+)(?=$|\$)/.exec(source);
      if (stretchMatch) {
        const params: StretchParam = [
          +stretchMatch[1] || 0,
          +stretchMatch[2] || 0,
          +stretchMatch[3] || 0,
          +stretchMatch[4] || 0,
        ];
        store.dispatch(editorActions.loadedStretchParam([name, params]));
      }
      store.dispatch(editorActions.loadedBuhin([name, source]));
      waiting.delete(name);
    })
    .catch((err) => console.error(err));
};

export const makeGlyphSeparated = memoizeOne((glyph: Glyph, map: Map<string, string>): Polygons[] => {
  const data = glyph.map(unparseGlyphLine);
  kage.kBuhin.search = (name) => {
    const result = map.get(name);
    if (typeof result === 'undefined') {
      loadAbsentBuhin(name);
      return '';
    }
    return result;
  };
  const result = kage.makeGlyphSeparated(data);
  return result;
});
