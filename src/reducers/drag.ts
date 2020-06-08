import { ReducerBuilder } from 'typescript-fsa-reducers';

// @ts-ignore
import { polygonInPolygon, polygonIntersectsPolygon } from 'geometric';

import { dragActions, RectPointPosition } from '../actions/drag';

import { moveSelectedGlyphLines, moveSelectedPoint, resizeSelectedGlyphLines } from '../kageUtils/transform';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { GlyphLine, Glyph } from '../kageUtils/glyph';
import { makeGlyphSeparated } from '../kage';

import { AppState } from '.';

const performAreaSelect = (glyph: Glyph, buhinMap: Map<string, string>, x1: number, y1: number, x2: number, y2: number): number[] => {
  const polygonsSep = makeGlyphSeparated(glyph, buhinMap);
  const result = [];

  const gAreaPolygon: [number, number][] = [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1],
  ];

  for (let index = 0; index < polygonsSep.length; index++) {
    const polygons = polygonsSep[index];
    if (polygons.array.some((polygon) => {
      const gPolygon = polygon.array.map(({ x, y }) => [x, y]);
      gPolygon.push(gPolygon[0]); // close polygon

      return (
        polygonInPolygon(gAreaPolygon, gPolygon) ||
        polygonInPolygon(gPolygon, gAreaPolygon) ||
        polygonIntersectsPolygon(gAreaPolygon, gPolygon)
      ) as boolean;
    })) {
      result.push(index);
    }
  }
  return result;
};

export const resizeSelected = (glyph: Glyph, selection: number[], position: RectPointPosition, dx: number, dy: number): Glyph => {
  if (selection.length === 1) {
    const selectedGlyphLine = glyph[selection[0]];
    switch (selectedGlyphLine.value[0]) {
      case 0:
      case 9:
      case 99: {
        const newValue = selectedGlyphLine.value.slice();
        switch (position) {
          case RectPointPosition.north:
            newValue[4] += dy;
            break;
          case RectPointPosition.west:
            newValue[3] += dx;
            break;
          case RectPointPosition.south:
            newValue[6] += dy;
            break;
          case RectPointPosition.east:
            newValue[5] += dx;
            break;
          case RectPointPosition.southeast:
            newValue[5] += dx;
            newValue[6] += dy;
            break;
          default:
            // exhaustive?
            ((_x: never) => { })(position);
        }
        const newGlyphLine: GlyphLine = selectedGlyphLine.value[0] === 99
          ? { value: newValue, partName: selectedGlyphLine.partName }
          : { value: newValue };
        return glyph.map((glyphLine, index) => index === selection[0] ? newGlyphLine : glyphLine);
      }
    }
  }
  const minSize = 20;
  const oldBBX = getGlyphLinesBBX(selection.map((index) => glyph[index]));
  const newBBX = oldBBX.slice() as typeof oldBBX;
  switch (position) {
    case RectPointPosition.north:
      newBBX[1] = Math.min(newBBX[1] + dy, newBBX[3] - minSize);
      break;
    case RectPointPosition.west:
      newBBX[0] = Math.min(newBBX[0] + dx, newBBX[2] - minSize);
      break;
    case RectPointPosition.south:
      newBBX[3] = Math.max(newBBX[3] + dy, newBBX[1] + minSize);
      break;
    case RectPointPosition.east:
      newBBX[2] = Math.max(newBBX[2] + dx, newBBX[0] + minSize);
      break;
    case RectPointPosition.southeast:
      newBBX[2] = Math.max(newBBX[2] + dx, newBBX[0] + minSize);
      newBBX[3] = Math.max(newBBX[3] + dy, newBBX[1] + minSize);
      break;
    default:
      // exhaustive?
      ((_x: never) => { })(position);
  }
  return resizeSelectedGlyphLines(glyph, selection, oldBBX, newBBX);
};

export const applyDraggingEffectToGlyph = (state: AppState): Glyph => {
  let glyph = state.glyph;
  if (state.dragSelection) {
    const [x1, y1, x2, y2] = state.dragSelection;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = moveSelectedGlyphLines(state.glyph, state.selection, dx, dy);
  } else if (state.dragPoint) {
    const [pointIndex, [x1, y1, x2, y2]] = state.dragPoint;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = moveSelectedPoint(state.glyph, state.selection, pointIndex, dx, dy);
  } else if (state.resizeSelection) {
    const [position, [x1, y1, x2, y2]] = state.resizeSelection;
    const dx = x2 - x1;
    const dy = y2 - y1;
    glyph = resizeSelected(state.glyph, state.selection, position, dx, dy);
  }
  return glyph;
};

export default (builder: ReducerBuilder<AppState>) => builder
  .case(dragActions.startAreaSelect, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      areaSelectRect: [x1, y1, x1, y1],
    };
  })
  .case(dragActions.startSelectionDrag, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      dragSelection: [x1, y1, x1, y1],
    };
  })
  .case(dragActions.startPointDrag, (state, [evt, pointIndex]) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      dragPoint: [pointIndex, [x1, y1, x1, y1]],
    };
  })
  .case(dragActions.startResize, (state, [evt, position]) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      resizeSelection: [position, [x1, y1, x1, y1]],
    };
  })

  .case(dragActions.mouseMove, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    if (state.areaSelectRect) {
      const [x1, y1] = state.areaSelectRect;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      return {
        ...state,
        areaSelectRect: [x1, y1, x2, y2],
      };
    }
    if (state.dragSelection) {
      const [x1, y1] = state.dragSelection;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      return {
        ...state,
        dragSelection: [x1, y1, x2, y2],
      };
    }
    if (state.dragPoint) {
      const [pointIndex, [x1, y1]] = state.dragPoint;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      return {
        ...state,
        dragPoint: [pointIndex, [x1, y1, x2, y2]],
      };
    }
    if (state.resizeSelection) {
      const [position, [x1, y1]] = state.resizeSelection;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      return {
        ...state,
        resizeSelection: [position, [x1, y1, x2, y2]],
      };
    }
    return state;
  })
  .case(dragActions.mouseUp, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    if (state.areaSelectRect) {
      const [x1, y1] = state.areaSelectRect;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      const intersections = performAreaSelect(state.glyph, state.buhinMap, x1, y1, x2, y2);

      const newSelection = Array.from(new Set(state.selection.concat(intersections)));
      return {
        ...state,
        selection: newSelection,
        areaSelectRect: null,
      };
    }
    if (state.dragSelection) {
      const [x1, y1] = state.dragSelection;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);

      const newGlyph = moveSelectedGlyphLines(state.glyph, state.selection, x2 - x1, y2 - y1);
      return {
        ...state,
        glyph: newGlyph,
        dragSelection: null,
      };
    }
    if (state.dragPoint) {
      const [pointIndex, [x1, y1]] = state.dragPoint;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);

      const newGlyph = moveSelectedPoint(state.glyph, state.selection, pointIndex, x2 - x1, y2 - y1);
      return {
        ...state,
        glyph: newGlyph,
        dragPoint: null,
      };
    }
    if (state.resizeSelection) {
      const [position, [x1, y1]] = state.resizeSelection;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);

      const newGlyph = resizeSelected(state.glyph, state.selection, position, x2 - x1, y2 - y1);
      return {
        ...state,
        glyph: newGlyph,
        resizeSelection: null,
      };
    }
    return state;
  })

  .case(dragActions.updateCTMInv, (state, ctmInv) => ({
    ...state,
    ctmInv,
  }));
