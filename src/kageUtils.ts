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
}, ([gLines1], [gLines2]) => (
  gLines1.length === gLines2.length &&
  gLines1.every((gLine1, index) => gLine1 === gLines2[index])
));


export interface PointDescriptor {
  lineIndex: number;
  pointIndex: number;
}

const applyGlyphPointOperation = (glyph: Glyph, pdescs: PointDescriptor[], tX: (x: number) => number, tY: (y: number) => number): Glyph => {
  if (pdescs.length === 0) {
    return glyph;
  }
  const newGlyph = glyph.slice();
  for (const { lineIndex, pointIndex } of pdescs) {
    const glyphLine = newGlyph[lineIndex];
    const newValue = glyphLine.value.slice();
    newValue[3 + pointIndex * 2] = tX(newValue[3 + pointIndex * 2]);
    newValue[3 + pointIndex * 2 + 1] = tY(newValue[3 + pointIndex * 2 + 1]);
    newGlyph[lineIndex] = {
      ...glyphLine,
      value: newValue,
    };
  }
  return newGlyph;
};


interface ConnectablePoint {
  position: 'start' | 'end';
  strokeType: number;
  shapeType: number;
  coord: [number, number];
  pointIndex: number;
}

interface ConnectablePointFilter {
  position: 'start' | 'end';
  strokeTypes: number[];
  shapeTypes: number[];
}

const connectablePairs: [ConnectablePointFilter, ConnectablePointFilter][] = [
  [
    // 左上
    {
      position: 'start',
      strokeTypes: [1],
      shapeTypes: [2],
    },
    {
      position: 'start',
      strokeTypes: [1, 2, 3, 4, 6, 7],
      shapeTypes: [12],
    },
  ],
  [
    // 左下
    {
      position: 'start',
      strokeTypes: [1],
      shapeTypes: [2],
    },
    {
      position: 'end',
      strokeTypes: [1],
      shapeTypes: [13, 313, 413],
    },
  ],
  [
    // 右上
    {
      position: 'end',
      strokeTypes: [1],
      shapeTypes: [2],
    },
    {
      position: 'start',
      strokeTypes: [1, 2, 3, 4, 6, 7],
      shapeTypes: [22],
    },
  ],
  [
    // 右下
    {
      position: 'end',
      strokeTypes: [1],
      shapeTypes: [2],
    },
    {
      position: 'end',
      strokeTypes: [1],
      shapeTypes: [23, 24],
    },
  ],
];

const matchConnectablePoint = (filter: ConnectablePointFilter, point: ConnectablePoint) => (
  filter.position === point.position &&
  filter.strokeTypes.includes(point.strokeType) &&
  filter.shapeTypes.includes(point.shapeType)
)

const isConnectable = (point1: ConnectablePoint, point2: ConnectablePoint) => (
  point1.coord[0] === point2.coord[0] &&
  point1.coord[1] === point2.coord[1] &&
  connectablePairs.some(([filter1, filter2]) => (
    (matchConnectablePoint(filter1, point1) && matchConnectablePoint(filter2, point2)) ||
    (matchConnectablePoint(filter2, point1) && matchConnectablePoint(filter1, point2))
  ))
);

const getConnectablePoints = (glyphLine: GlyphLine): ConnectablePoint[] => {
  const result: ConnectablePoint[] = [];
  switch (glyphLine.value[0]) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 6:
    case 7: {
      result.push({
        position: 'start',
        strokeType: glyphLine.value[0],
        shapeType: glyphLine.value[1],
        coord: [
          glyphLine.value[3],
          glyphLine.value[4],
        ],
        pointIndex: 0,
      });
      const endPointIndex = (getNumColumns(glyphLine.value[0]) - 3) / 2 - 1;
      result.push({
        position: 'end',
        strokeType: glyphLine.value[0],
        shapeType: glyphLine.value[2],
        coord: [
          glyphLine.value[3 + endPointIndex * 2],
          glyphLine.value[3 + endPointIndex * 2 + 1],
        ],
        pointIndex: endPointIndex,
      });
      break;
    }
  }
  return result;
};

export const listupConnectedPoints = memoizeOne((glyph: Glyph, points: PointDescriptor[]): PointDescriptor[] => {
  const sPoints: ConnectablePoint[] = [];
  for (const { lineIndex, pointIndex } of points) {
    for (const sPoint of getConnectablePoints(glyph[lineIndex])) {
      if (sPoint.pointIndex === pointIndex) {
        sPoints.push(sPoint);
      }
    }
  }
  const result: PointDescriptor[] = [];
  glyph.forEach((glyphLine, lineIndex) => {
    for (const dPoint of getConnectablePoints(glyphLine)) {
      if (sPoints.some((sPoint) => isConnectable(sPoint, dPoint))) {
        result.push({
          lineIndex,
          pointIndex: dPoint.pointIndex,
        });
      }
    }
  });
  return result;
}, ([glyph1, points1], [glyph2, points2]) => (
  glyph1 === glyph2 &&
  points1.length === points2.length &&
  points1.every((point1, index) => (
    point1.lineIndex === points2[index].lineIndex &&
    point1.pointIndex === points2[index].pointIndex
  ))
));

const listupConnectedPointsOfSelection = memoizeOne((glyph: Glyph, selection: number[]): PointDescriptor[] => {
  const selectedDescs: PointDescriptor[] = [];
  for (const lineIndex of selection) {
    const glyphLine = glyph[lineIndex];
    selectedDescs.push({ lineIndex, pointIndex: 0 });
    selectedDescs.push({ lineIndex, pointIndex: (getNumColumns(glyphLine.value[0]) - 3) / 2 });
  }
  return listupConnectedPoints(glyph, selectedDescs)
    .filter(({ lineIndex }) => !selection.includes(lineIndex));
});


export const moveSelectedGlyphLines = (glyph: Glyph, selection: number[], dx: number, dy: number): Glyph => {
  const targetDescs = listupConnectedPointsOfSelection(glyph, selection);

  const tX = (x: number) => Math.round(x + dx);
  const tY = (y: number) => Math.round(y + dy);
  glyph = glyph.map((glyphLine, index) => selection.includes(index)
    ? applyGlyphLineOperation(glyphLine, tX, tY)
    : glyphLine
  );
  glyph = applyGlyphPointOperation(glyph, targetDescs, tX, tY);
  return glyph;
};

export const moveSelectedPoint = (glyph: Glyph, selection: number[], pointIndex: number, dx: number, dy: number): Glyph => {
  if (selection.length === 0) {
    return glyph;
  }
  const lineIndex = selection[0];
  const selectedDesc: PointDescriptor = { lineIndex, pointIndex };
  const targetDescs = listupConnectedPoints(glyph, [selectedDesc])
    .filter((targetDesc) => targetDesc.lineIndex !== lineIndex);
  targetDescs.push(selectedDesc);

  const tX = (x: number) => Math.round(x + dx);
  const tY = (y: number) => Math.round(y + dy);
  glyph = applyGlyphPointOperation(glyph, targetDescs, tX, tY);
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
