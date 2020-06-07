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

export const getGlyphLinesBBX = (glyphLines: GlyphLine[]): BBX => {
  return glyphLines.map(getGlyphLineBBX).reduce(mergeBBX, bbxOfPoints([]));
};


export const moveSelectedGlyphLines = (glyph: Glyph, selection: number[], dx: number, dy: number): Glyph => {
  // FIXME
  return glyph;
};

export const moveSelectedPoint = (glyph: Glyph, selection: number[], pointIndex: number, dx: number, dy: number): Glyph => {
  // FIXME
  return glyph;
};

export const resizeSelectedGlyphLines = (glyph: Glyph, selection: number[], oldBBX: BBX, newBBX: BBX): Glyph => {
  // FIXME
  return glyph;
};
