import memoizeOne from 'memoize-one';

import { GlyphLine, Glyph, PointDescriptor, getNumColumns } from './glyph';

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
      shapeTypes: [22, 27],
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

export const listupConnectedPointsOfSelection = memoizeOne((glyph: Glyph, selection: number[]): PointDescriptor[] => {
  const selectedDescs: PointDescriptor[] = [];
  for (const lineIndex of selection) {
    const glyphLine = glyph[lineIndex];
    selectedDescs.push({ lineIndex, pointIndex: 0 });
    selectedDescs.push({ lineIndex, pointIndex: (getNumColumns(glyphLine.value[0]) - 3) / 2 - 1 });
  }
  return listupConnectedPoints(glyph, selectedDescs)
    .filter(({ lineIndex }) => !selection.includes(lineIndex));
});
