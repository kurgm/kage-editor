import { kage } from '../kage';

import { GlyphLine, parseGlyph, unparseGlyph } from './glyph';
import { getStretchPositions, normalizeStretchPositions, setStretchPositions } from './stretchparam';
import { applyGlyphLineOperation } from './transform';

export const decompose = (glyphLine: GlyphLine, buhinMap: Map<string, string>): GlyphLine[] => {
  if (glyphLine.value[0] !== 99) {
    return [glyphLine];
  }
  const buhinSource = buhinMap.get(glyphLine.partName!);
  if (!buhinSource) {
    return [glyphLine];
  }

  let failedBuhin = false;
  kage.kBuhin.search = (name: string) => {
    const data = buhinMap.get(name);
    if (typeof data !== 'string') {
      failedBuhin = true;
      return '';
    }
    return data;
  };

  const glyph = parseGlyph(buhinSource);

  const strokesArray =
    // @ts-ignore 2445
    kage.getEachStrokes(
      unparseGlyph(glyph)
    );
  const box =
    // @ts-ignore 2445
    kage.getBox(
      strokesArray
    );

  if (failedBuhin) {
    return [glyphLine];
  }

  const x1 = glyphLine.value[3];
  const y1 = glyphLine.value[4];
  const x2 = glyphLine.value[5];
  const y2 = glyphLine.value[6];
  const [sx, sy, tx, ty] = normalizeStretchPositions(getStretchPositions(glyphLine)!);
  const isStretchEnabled = !(sx === tx - 200 && sy === ty);

  return glyph.map((oldGlyphLine) => {
    const tX = (x: number) => {
      const stretchedX = isStretchEnabled
        ? kage.stretch(tx - 200, sx, x, box.minX, box.maxX)
        : x;
      return Math.round(stretchedX / 200 * (x2 - x1) + x1);
    };
    const tY = (y: number) => {
      const stretchedY = isStretchEnabled
        ? kage.stretch(ty, sy, y, box.minY, box.maxY)
        : y;
      return Math.round(stretchedY / 200 * (y2 - y1) + y1);
    };
    const newGlyphLine = applyGlyphLineOperation(oldGlyphLine, tX, tY);

    if (!(isStretchEnabled && newGlyphLine.value[0] === 99)) {
      return newGlyphLine;
    }

    const [sx2, sy2, tx2, ty2] = normalizeStretchPositions(getStretchPositions(newGlyphLine)!);
    if (!(sx2 === tx2 - 200 && sy2 === ty2)) {
      // Cannot compose two stretches...
      return newGlyphLine;
    }

    const px1 = newGlyphLine.value[3];
    const py1 = newGlyphLine.value[4];
    const px2 = newGlyphLine.value[5];
    const py2 = newGlyphLine.value[6];

    if (px1 === px2 || py1 === py2) {
      return newGlyphLine;
    }

    const revX = (x: number) => (x - px1) / (px2 - px1) * 200;
    const revY = (y: number) => (y - py1) / (py2 - py1) * 200;
    return setStretchPositions(newGlyphLine, [
      revX(sx2 + 100),
      revY(sy2 + 100),
      revX(tx2 - 100) + 100,
      revY(ty2 + 100),
    ]);
  });
};
