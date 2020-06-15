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
    case 3:
    case 4:
      return 9;
    case 6:
    case 7:
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
  const values: (number | string)[] = glyphLine.value.map((num) => Math.round(num));
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

export const isGlyphDeepEqual = (glyph1: Glyph, glyph2: Glyph) => (
  glyph1 === glyph2 || (
    glyph1.length === glyph2.length &&
    glyph1.every((glyphLine1, index) => {
      const glyphLine2 = glyph2[index];
      return glyphLine1 === glyphLine2 || (
        glyphLine1.partName === glyphLine2.partName &&
        glyphLine1.value.length === glyphLine2.value.length &&
        glyphLine1.value.every((value1, index) => value1 === glyphLine2.value[index])
      );
    })
  )
);


export interface PointDescriptor {
  lineIndex: number;
  pointIndex: number;
}
