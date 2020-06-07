import memoizeOne from 'memoize-one';

import { GlyphLine } from './glyph';

export type BBX = [number, number, number, number];

export const bbxOfPoints = (points: [number, number][]): BBX => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return [
    Math.min(...xs),
    Math.min(...ys),
    Math.max(...xs),
    Math.max(...ys),
  ];
};

export const getGlyphLineBBX = (glyphLine: GlyphLine): BBX => {
  switch (glyphLine.value[0]) {
    case 99:
      return bbxOfPoints([
        [glyphLine.value[3], glyphLine.value[4]],
        [glyphLine.value[5], glyphLine.value[6]],
      ]);
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 9: {
      const points: [number, number][] = [];
      for (let i = 3; i + 2 <= glyphLine.value.length; i += 2) {
        points.push([glyphLine.value[i], glyphLine.value[i + 1]]);
      }
      return bbxOfPoints(points);
    }
    default:
      return bbxOfPoints([]);
  }
}

export const mergeBBX = ([x11, y11, x12, y12]: BBX, [x21, y21, x22, y22]: BBX): BBX => [
  Math.min(x11, x21),
  Math.min(y11, y21),
  Math.max(x12, x22),
  Math.max(y12, y22),
];

export const getGlyphLinesBBX = memoizeOne((glyphLines: GlyphLine[]): BBX => {
  return glyphLines.map(getGlyphLineBBX).reduce(mergeBBX, bbxOfPoints([]));
}, ([gLines1], [gLines2]) => (
  gLines1.length === gLines2.length &&
  gLines1.every((gLine1, index) => gLine1 === gLines2[index])
));
