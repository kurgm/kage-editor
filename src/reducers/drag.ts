import { ReducerBuilder } from 'typescript-fsa-reducers';

import { polygonInPolygon, polygonIntersectsPolygon, Polygon as GPolygon } from 'geometric';

import { dragActions } from '../actions/drag';

import { Glyph } from '../kageUtils/glyph';
import { moveSelectedGlyphLines, moveSelectedPoint } from '../kageUtils/transform';
import { drawFreehand } from '../kageUtils/freehand';
import { makeGlyphSeparated, KShotai } from '../kage';

import { AppState } from '.';
import { resizeSelected } from '../selectors/draggedGlyph';

const performAreaSelect = (glyph: Glyph, buhinMap: Map<string, string>, shotai: KShotai, x1: number, y1: number, x2: number, y2: number): number[] => {
  const polygonsSep = makeGlyphSeparated(glyph, buhinMap, shotai);
  const result = [];

  const gAreaPolygon: GPolygon = [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1],
  ];

  for (let index = 0; index < polygonsSep.length; index++) {
    const polygons = polygonsSep[index];
    if (polygons.array.some((polygon) => {
      const gPolygon: GPolygon = polygon.array.map(({ x, y }) => [x, y]);
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

const updateBuilder = (builder: ReducerBuilder<AppState>) => builder
  .case(dragActions.startBackgroundDrag, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    if (state.freehandMode) {
      return {
        ...state,
        freehandStroke: [[x1, y1]],
      };
    }
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
    if (state.freehandStroke) {
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      let freehandStroke = state.freehandStroke.concat([[x2, y2]]);
      if (freehandStroke.length >= 3) {
        const [lastX, lastY] = freehandStroke[freehandStroke.length - 2];
        if (Math.abs(x2 - lastX) < 2 && Math.abs(y2 - lastY) < 2) {
          freehandStroke.splice(freehandStroke.length - 2, 1);
        }
      }
      return {
        ...state,
        freehandStroke,
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
      const intersections = performAreaSelect(state.glyph, state.buhinMap, state.shotai, x1, y1, x2, y2);

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
    if (state.freehandStroke) {
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      const freehandStroke = state.freehandStroke.concat([[x2, y2]]);

      const newGlyph = drawFreehand(state.glyph, freehandStroke);
      return {
        ...state,
        glyph: newGlyph,
        freehandStroke: null,
      };
    }
    return state;
  })

  .case(dragActions.updateCTMInv, (state, ctmInv) => ({
    ...state,
    ctmInv,
  }));


export default updateBuilder;
