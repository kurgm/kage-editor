import memoizeOne from 'memoize-one';

import { Kage, Polygons } from '@kurgm/kage-engine';
import { Glyph, unparseGlyphLine } from './kageUtils/glyph';
import { StretchParam } from './kageUtils/stretchparam';

import store from './store';
import { editorActions } from './actions/editor';

import { getSource } from './callapi';

export type KShotai = Kage["kShotai"];

const kage_ = new Kage();

export const getKage = (buhinMap: Map<string, string>, fallback?: (name: string) => string | undefined | void, shotai?: KShotai): Kage => {
  kage_.kBuhin.search = (name) => {
    let result = buhinMap.get(name);
    if (typeof result === 'undefined') {
      result = fallback?.(name) || '';
    }
    return result;
  };
  if (typeof shotai !== 'undefined') {
    kage_.kShotai = shotai;
  }
  return kage_;
};

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

const filteredGlyphIsEqual = (glyph1: Glyph, glyph2: Glyph) => (
  glyph1.length === glyph2.length &&
  glyph1.every((gLine1, index) => (
    gLine1 === glyph2[index]
  ))
);

const makeGlyphSeparated_ = memoizeOne((glyph: Glyph, map: Map<string, string>, shotai: KShotai): Polygons[] => {
  const data = glyph.map(unparseGlyphLine);
  const result = getKage(map, loadAbsentBuhin, shotai).makeGlyphSeparated(data);
  return result;
}, ([glyph1, map1, shotai1], [glyph2, map2, shotai2]) => (
  map1 === map2 &&
  shotai1 === shotai2 &&
  filteredGlyphIsEqual(glyph1, glyph2)
));

const makeGlyphSeparatedFactory = (
  isEqual?: (newArgs: Parameters<typeof makeGlyphSeparated_>, lastArgs: Parameters<typeof makeGlyphSeparated_>) => boolean
) => memoizeOne((glyph: Glyph, map: Map<string, string>, shotai: KShotai): Polygons[] => {
  return makeGlyphSeparated_(glyph, map, shotai);
}, isEqual);

export const makeGlyphSeparated = makeGlyphSeparatedFactory();
export const makeGlyphSeparatedForSubmit = makeGlyphSeparatedFactory(
  ([glyph1, map1, shotai1], [glyph2, map2, shotai2]) => (
    map1 === map2 &&
    shotai1 === shotai2 &&
    filteredGlyphIsEqual(glyph1, glyph2)
  )
);
