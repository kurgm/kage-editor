import { reducerWithInitialState } from 'typescript-fsa-reducers';

// @ts-ignore
import { polygonInPolygon, polygonIntersectsPolygon } from 'geometric';

import { editorActions } from '../actions/editor';
import { Glyph, parseGlyph } from '../kageUtils';
import { makeGlyphSeparated } from '../kage';

import args from '../args';


const performAreaSelect = (glyph: Glyph, x1: number, y1: number, x2: number, y2: number): number[] => {
  const polygonsSep = makeGlyphSeparated(glyph);
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

const moveSelected = (glyph: Glyph, selection: number[], dx: number, dy: number): Glyph => {
  // FIXME
  return glyph;
};


export interface EditorState {
  glyph: Glyph;
  selection: number[];
  areaSelectRect: [number, number, number, number] | null;
  dragSelection: [number, number, number, number] | null;
  ctmInv: ((x: number, y: number) => [number, number]) | null;
}

const initialState: EditorState = {
  glyph: parseGlyph(args.get('data') || ''),
  selection: [],
  areaSelectRect: null,
  dragSelection: null,
  ctmInv: null,
};

const editor = reducerWithInitialState(initialState)
  .case(editorActions.selectSingle, (state, index) => ({
    ...state,
    selection: [index],
  }))
  .case(editorActions.selectAddSingle, (state, index) => ({
    ...state,
    selection: state.selection.includes(index) ? state.selection : state.selection.concat([index]),
  }))
  .case(editorActions.selectRemoveSingle, (state, index) => ({
    ...state,
    selection: state.selection.filter((index2) => index !== index2),
  }))
  .case(editorActions.selectAll, (state) => ({
    ...state,
    selection: state.glyph.map((_gLine, index) => index),
  }))
  .case(editorActions.selectNone, (state) => ({
    ...state,
    selection: [],
  }))
  .case(editorActions.selectPrev, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? 0 : Math.min(...state.selection);
    return {
      ...state,
      selection: [(firstSelected - 1 + state.glyph.length) % state.glyph.length],
    };
  })
  .case(editorActions.selectNext, (state) => {
    if (state.glyph.length === 0) {
      return { ...state, selection: [] };
    }
    const firstSelected = state.selection.length === 0 ? -1 : Math.max(...state.selection);
    return {
      ...state,
      selection: [(firstSelected + 1 + state.glyph.length) % state.glyph.length],
    };
  })

  .case(editorActions.startAreaSelect, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      areaSelectRect: [x1, y1, x1, y1],
    };
  })
  .case(editorActions.startSelectionDrag, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      dragSelection: [x1, y1, x1, y1],
    };
  })

  .case(editorActions.mouseMove, (state, evt) => {
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
    return state;
  })
  .case(editorActions.mouseUp, (state, evt) => {
    if (!state.ctmInv) {
      return state;
    }
    if (state.areaSelectRect) {
      const [x1, y1] = state.areaSelectRect;
      const [x2, y2] = state.ctmInv(evt.clientX, evt.clientY);
      const intersections = performAreaSelect(state.glyph, x1, y1, x2, y2);

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

      const newGlyph = moveSelected(state.glyph, state.selection, x2 - x1, y2 - y1);
      return {
        ...state,
        glyph: newGlyph,
        dragSelection: null,
      };
    }
    return state;
  })

  .case(editorActions.updateCTMInv, (state, ctmInv) => ({
    ...state,
    ctmInv,
  }));

export default editor;
