import { Glyph, GlyphLine } from './glyph';
import { applyGlyphLineOperation } from './transform';

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);
const avg = (nums: number[]) => sum(nums) / nums.length;

const lerp = (x1: number, x2: number, k: number) => x1 * (1 - k) + x2 * k;
const norm2 = (dx: number, dy: number) => dx * dx + dy * dy;

export const drawFreehand = (glyph: Glyph, points: [number, number][]): Glyph => {
  const [startX, startY] = points[0];
  const [endX, endY] = points[points.length - 1];
  const dx = endX - startX;
  const dy = endY - startY;

  if (glyph.length > 0 && norm2(dx, dy) < 25 ** 2) {
    const lastStroke = glyph[glyph.length - 1];
    // ハネ部分かどうか？
    if (
      [1, 2].includes(lastStroke.value[0]) &&
      norm2(
        startX - lastStroke.value[lastStroke.value.length - 2],
        startY - lastStroke.value[lastStroke.value.length - 1]
      ) < 10 ** 2
    ) {
      if (dx < 0) { // 左ハネに変更
        const newLastStroke: GlyphLine = {
          value: lastStroke.value.slice(),
        };
        newLastStroke.value[2] = 4;
        return glyph.slice(0, -1).concat([newLastStroke]);
      }
      if (lastStroke.value[0] === 2 && dx > 0 && dy < 0) { // 右ハネに変更
        const newLastStroke: GlyphLine = {
          value: lastStroke.value.slice(),
        };
        newLastStroke.value[2] = 5;
        return glyph.slice(0, -1).concat([newLastStroke]);
      }
    }
  }

  const centroidX = avg(points.map(([x]) => x));
  const centroidY = avg(points.map(([_x, y]) => y));

  const midLerpRate = 3;
  const midX = lerp((startX + endX) / 2, centroidX, midLerpRate);
  const midY = lerp((startY + endY) / 2, centroidY, midLerpRate);

  const dis = (dx * midY - dy * midX + startX * endY - startY * endX) / Math.sqrt(norm2(dx, dy));
  if (Math.abs(dis) > 5) {
    // 曲線
    let startType = 0;
    let endType = 0;
    if (dx < 0 && dy > 0 && dis < 0) { // 左払い
      startType = 0;
      endType = 7;
    } else if (dx > 0 && dy > 0 && dis > 0) { // 右払い
      startType = 7;
      endType = 0;
    } else if (dx > 0 && dy > 0 && dis < 0) { // 止め
      startType = 7;
      endType = 8;
    } else if (dx > 0 && dy < 0 && dis > 0) { // 右上方向の「左払い」
      startType = 0;
      endType = 7;
    }
    const newStroke: GlyphLine = {
      value: [2, startType, endType, startX, startY, midX, midY, endX, endY],
    };
    return correctStroke(glyph, newStroke);
  }

  const newStroke: GlyphLine = {
    value: [1, 0, 0, startX, startY, endX, endY],
  };
  return correctStroke(glyph, newStroke);
};

const round = (x: number) => Math.round(x);

const correctStroke = (glyph: Glyph, newStroke: GlyphLine): Glyph => {
  glyph = snapStrokeStart(glyph, newStroke);
  snapStrokeTilt(newStroke);
  glyph = snapStrokeEnd(glyph, newStroke);
  newStroke = applyGlyphLineOperation(newStroke, round, round)
  glyph = snapToNewStroke(glyph, newStroke);
  return glyph.concat([newStroke]);
};

const setGlyphValue = (glyph: Glyph, lineIndex: number, column: number, value: number): Glyph => {
  if (glyph[lineIndex].value[column] === value) {
    return glyph;
  }
  return glyph.map((gLine, index) => {
    if (index !== lineIndex) {
      return gLine;
    }
    const newGLine = {
      ...gLine,
      value: gLine.value.slice(),
    };
    newGLine.value[column] = value;
    return newGLine;
  });
};

const snapVerticalStroke = (
  glyph: Glyph, vertStroke: GlyphLine, position: 'start' | 'end',
  leftType: number, middleType: number, rightType: number
): Glyph => {
  const ti = position === 'start' ? 1 : 2;
  const xi = position === 'start' ? 3 : vertStroke.value.length - 2;
  const yi = xi + 1;
  const nx = vertStroke.value[xi];
  const ny = vertStroke.value[yi];
  const minX = nx - 10;
  const maxX = nx + 10;
  const minY = ny - 10;
  const maxY = ny + 10;
  for (let lineIndex = glyph.length - 1; lineIndex >= 0; lineIndex--) {
    const horiStroke = glyph[lineIndex];
    if (horiStroke.value[0] !== 1) {
      continue;
    }
    const x1 = horiStroke.value[3];
    const y1 = horiStroke.value[4];
    const x2 = horiStroke.value[5];
    const y2 = horiStroke.value[6];
    if (x2 - x1 < Math.abs(y2 - y1)) {
      continue;
    }
    if (
      [0, 2].includes(horiStroke.value[1]) &&
      minX <= x1 && x1 <= maxX &&
      minY <= y1 && y1 <= maxY
    ) {
      vertStroke.value[xi] = x1;
      vertStroke.value[yi] = y1;
      vertStroke.value[ti] = leftType;
      return setGlyphValue(glyph, lineIndex, 1, 2); // 接続(横)
    }
    if (
      [0, 2].includes(horiStroke.value[2]) &&
      minX <= x2 && x2 <= maxX &&
      minY <= y2 && y2 <= maxY
    ) {
      vertStroke.value[xi] = x2;
      vertStroke.value[yi] = y2;
      vertStroke.value[ti] = rightType;
      return setGlyphValue(glyph, lineIndex, 2, 2); // 接続(横)
    }
    if (y1 === y2 && minY <= y1 && y1 <= maxY && x1 <= nx && nx <= x2) {
      vertStroke.value[yi] = y1;
      vertStroke.value[ti] = middleType;
      return glyph;
    }
  }
  return glyph;
};

const snapHorizontalStroke = (glyph: Glyph, horiStroke: GlyphLine, position: 'start' | 'end'): Glyph => {
  const ti = position === 'start' ? 1 : 2;
  const xi = position === 'start' ? 3 : 5;
  const yi = xi + 1;
  const nx = horiStroke.value[xi];
  const ny = horiStroke.value[yi];
  const minX = nx - 10;
  const maxX = nx + 10;
  const minY = ny - 10;
  const maxY = ny + 10;
  for (let lineIndex = glyph.length - 1; lineIndex >= 0; lineIndex--) {
    const vertStroke = glyph[lineIndex];
    if (![1, 2, 3, 4, 6, 7].includes(vertStroke.value[0])) {
      continue;
    }
    const x1 = vertStroke.value[3];
    const y1 = vertStroke.value[4];
    const x2 = vertStroke.value[5];
    const y2 = vertStroke.value[6];
    if (vertStroke.value[0] === 1 && x2 - x1 > Math.abs(y2 - y1)) {
      continue;
    }
    if (position === 'start') {
      if (
        [0, 12].includes(vertStroke.value[1]) &&
        minX <= x1 && x1 <= maxX &&
        minY <= y1 && y1 <= maxY
      ) {
        horiStroke.value[xi] = x1;
        horiStroke.value[yi] = y1;
        horiStroke.value[ti] = 2;
        return setGlyphValue(glyph, lineIndex, 1, 12); // 左上カド
      }
      if (
        vertStroke.value[0] === 1 &&
        [0, 13, 313, 413].includes(vertStroke.value[2]) &&
        minX <= x2 && x2 <= maxX &&
        minY <= y2 && y2 <= maxY
      ) {
        horiStroke.value[xi] = x2;
        horiStroke.value[yi] = y2;
        horiStroke.value[ti] = 2;
        return vertStroke.value[2] === 0
          ? setGlyphValue(glyph, lineIndex, 2, 13) // 左下カド
          : glyph;
      }
    } else {
      if (
        [0, 22].includes(vertStroke.value[1]) &&
        minX <= x1 && x1 <= maxX &&
        minY <= y1 && y1 <= maxY
      ) {
        horiStroke.value[xi] = x1;
        horiStroke.value[yi] = y1;
        horiStroke.value[ti] = 2;
        return setGlyphValue(glyph, lineIndex, 1, 22); // 右上カド
      }
      if (
        vertStroke.value[0] === 1 &&
        [0, 23, 24].includes(vertStroke.value[2]) &&
        minX <= x2 && x2 <= maxX &&
        minY <= y2 && y2 <= maxY
      ) {
        horiStroke.value[xi] = x2;
        horiStroke.value[yi] = y2;
        horiStroke.value[ti] = 2;
        return vertStroke.value[2] === 0
          ? setGlyphValue(glyph, lineIndex, 2, 23) // 右下カド
          : glyph;
      }
    }
    if (x1 === x2 && minX <= x1 && x1 <= maxX && y1 <= ny && ny <= y2) {
      horiStroke.value[xi] = x1;
      horiStroke.value[ti] = 2;
      return glyph;
    }
  }
  return glyph;
};

const snapStrokeStart = (glyph: Glyph, newStroke: GlyphLine): Glyph => {
  if (newStroke.value[0] !== 1) {
    const y1 = newStroke.value[4];
    const y2 = newStroke.value[6];
    if (y1 > y2) {
      return glyph;
    }
    return snapVerticalStroke(glyph, newStroke, 'start', 12, 32, 22);
  }
  const x1 = newStroke.value[3];
  const y1 = newStroke.value[4];
  const x2 = newStroke.value[5];
  const y2 = newStroke.value[6];
  if (x2 - x1 > Math.abs(y2 - y1)) {
    return snapHorizontalStroke(glyph, newStroke, 'start');
  }
  if (y2 - y1 > 0) {
    return snapVerticalStroke(glyph, newStroke, 'start', 12, 32, 22);
  }
  return glyph;
};
const snapStrokeTilt = (newStroke: GlyphLine) => {
  if (newStroke.value[0] !== 1) {
    return;
  }
  const x1 = newStroke.value[3];
  const y1 = newStroke.value[4];
  const x2 = newStroke.value[5];
  const y2 = newStroke.value[6];

  const dx = x2 - x1;
  const dy = y2 - y1;
  if (Math.abs(dx) > Math.abs(dy) * 20) {
    newStroke.value[6] = y1;
    return;
  }
  if (Math.abs(dy) > Math.abs(dx) * 20) {
    newStroke.value[5] = x1;
    return;
  }
};
const snapStrokeEnd = (glyph: Glyph, newStroke: GlyphLine): Glyph => {
  if (newStroke.value[0] !== 1) {
    return glyph;
  }
  const x1 = newStroke.value[3];
  const y1 = newStroke.value[4];
  const x2 = newStroke.value[5];
  const y2 = newStroke.value[6];
  if (x2 - x1 > Math.abs(y2 - y1)) {
    return snapHorizontalStroke(glyph, newStroke, 'end');
  }
  if (y2 - y1 > 0) {
    return snapVerticalStroke(glyph, newStroke, 'end', 13, 32, 23);
  }
  return glyph;
};
const snapToNewStroke = (glyph: Glyph, newStroke: GlyphLine): Glyph => {
  if (newStroke.value[0] !== 1) {
    return glyph;
  }
  const x1 = newStroke.value[3];
  const y1 = newStroke.value[4];
  const x2 = newStroke.value[5];
  const y2 = newStroke.value[6];
  if (y1 !== y2) {
    return glyph;
  }
  const minY = y1 - 10;
  const maxY = y1 + 10;
  glyph.forEach((gLine, lineIndex) => {
    if (gLine.value[0] !== 1 || gLine.value[2] !== 0) {
      return;
    }
    const sx1 = gLine.value[3];
    const sy1 = gLine.value[4];
    const sx2 = gLine.value[5];
    const sy2 = gLine.value[6];
    if (sx2 - sx1 > Math.abs(sy2 - sy1)) {
      return;
    }
    if (minY <= sy2 && sy2 <= maxY && x1 <= sx2 && sx2 <= x2) {
      glyph = setGlyphValue(glyph, lineIndex, 2, 32);
      glyph = setGlyphValue(glyph, lineIndex, 6, y1);
    }
  });
  return glyph;
};
