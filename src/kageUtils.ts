import memoizeOne from 'memoize-one';

export interface GlyphLine {
  value: number[];
  partName?: string;
}

export const getNumColumns = (strokeType: number): number => {
  switch (strokeType) {
    case 0:
    case 1:
    case 9:
      return 7;
    case 2:
      return 9;
    case 3:
    case 4:
    case 6:
    case 99:
      return 11;
    default:
      return 0;
  }
};

export const parseGlyphLine = (glyphLineStr: string): GlyphLine => {
  const splitLine = glyphLineStr.split(':');
  const strokeType = +splitLine[0];
  const numColumns = getNumColumns(strokeType);
  const value = [];
  for (let i = 0; i < numColumns; i++) {
    value.push(Math.floor(+splitLine[i] || 0));
  }
  if (value[0] === 99) {
    const partName = splitLine[7] || '';
    return { value, partName }
  }
  return { value };
};

export const unparseGlyphLine = (glyphLine: GlyphLine): string => {
  const values: (number | string)[] = glyphLine.value.slice();
  if (values[0] === 99) {
    values[7] = glyphLine.partName || '';
  }
  return values.join(':');
};

export const isValidGlyphLine = (glyphLine: GlyphLine): boolean => (
  glyphLine.value.length !== 0 &&
  (
    glyphLine.value[0] !== 0 ||
    glyphLine.value[1] === 97 || glyphLine.value[1] === 98 || glyphLine.value[1] === 99
  )
);

const applyGlyphLineOperation = (glyphLine: GlyphLine, tX: (x: number) => number, tY: (y: number) => number): GlyphLine => {
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


export type Glyph = GlyphLine[];

export const parseGlyph = (glyphStr: string): Glyph => (
  glyphStr.split(/[$\r\n]+/)
    .map((line) => parseGlyphLine(line))
    .filter((gLine) => isValidGlyphLine(gLine))
);

export const unparseGlyph = (glyph: Glyph): string => (
  glyph
    .map((gLine) => unparseGlyphLine(gLine))
    .join('$')
);


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
}, (gLines1: GlyphLine[], gLines2: GlyphLine[]) => (
  gLines1.length === gLines2.length &&
  gLines1.every((gLine1, index) => gLine1 === gLines2[index])
));


export const moveSelectedGlyphLines = (glyph: Glyph, selection: number[], dx: number, dy: number): Glyph => {
  // FIXME
  return glyph;
};

export const moveSelectedPoint = (glyph: Glyph, selection: number[], pointIndex: number, dx: number, dy: number): Glyph => {
  // FIXME
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