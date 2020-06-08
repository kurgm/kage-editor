import { reducerWithInitialState } from 'typescript-fsa-reducers';

// @ts-ignore
import { polygonInPolygon, polygonIntersectsPolygon } from 'geometric';

import { editorActions, RectPointPosition } from '../actions/editor';
import { GlyphLine, Glyph, parseGlyph } from '../kageUtils/glyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { moveSelectedGlyphLines, moveSelectedPoint, resizeSelectedGlyphLines, applyGlyphLineOperation } from '../kageUtils/transform';
import { StretchParam } from '../kageUtils/stretchparam';
import { decompose } from '../kageUtils/decompose';
import { makeGlyphSeparated } from '../kage';

import args from '../args';


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

export const applyDraggingEffectToGlyph = (state: EditorState): Glyph => {
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
}


export interface EditorState {
  glyph: Glyph;
  selection: number[];
  areaSelectRect: [number, number, number, number] | null;
  dragSelection: [number, number, number, number] | null;
  dragPoint: [number, [number, number, number, number]] | null;
  resizeSelection: [RectPointPosition, [number, number, number, number]] | null;
  ctmInv: ((x: number, y: number) => [number, number]) | null;
  buhinMap: Map<string, string>;
  stretchParamMap: Map<string, StretchParam>;
  freehandMode: boolean;
  showOptionModal: boolean;
  clipboard: GlyphLine[];
}

const initialState: EditorState = {
  glyph: parseGlyph(args.get('data') || ''),
  selection: [],
  areaSelectRect: null,
  dragSelection: null,
  dragPoint: null,
  resizeSelection: null,
  ctmInv: null,
  buhinMap: new Map<string, string>(),
  stretchParamMap: new Map<string, StretchParam>(),
  freehandMode: false,
  showOptionModal: false,
  clipboard: [],
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
  .case(editorActions.selectDeselected, (state) => ({
    ...state,
    selection: state.glyph.map((_gLine, index) => index).filter((index) => !state.selection.includes(index)),
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
  .case(editorActions.startPointDrag, (state, [evt, pointIndex]) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      dragPoint: [pointIndex, [x1, y1, x1, y1]],
    };
  })
  .case(editorActions.startResize, (state, [evt, position]) => {
    if (!state.ctmInv) {
      return state;
    }
    const [x1, y1] = state.ctmInv(evt.clientX, evt.clientY);
    return {
      ...state,
      resizeSelection: [position, [x1, y1, x1, y1]],
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
  .case(editorActions.mouseUp, (state, evt) => {
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

  .case(editorActions.updateCTMInv, (state, ctmInv) => ({
    ...state,
    ctmInv,
  }))

  .case(editorActions.loadedBuhin, (state, [name, data]) => {
    const newMap = new Map(state.buhinMap);
    newMap.set(name, data);
    return {
      ...state,
      buhinMap: newMap,
    };
  })
  .case(editorActions.loadedStretchParam, (state, [name, param]) => {
    const newMap = new Map(state.stretchParamMap);
    newMap.set(name, param);
    return {
      ...state,
      stretchParamMap: newMap,
    }
  })

  .case(editorActions.swapWithPrev, (state) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    if (lineIndex === 0) {
      return state;
    }
    const newGlyph = state.glyph.slice();
    newGlyph[lineIndex - 1] = state.glyph[lineIndex];
    newGlyph[lineIndex] = state.glyph[lineIndex - 1];
    return {
      ...state,
      glyph: newGlyph,
      selection: [lineIndex - 1],
    };
  })
  .case(editorActions.swapWithNext, (state) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    if (lineIndex === state.glyph.length - 1) {
      return state;
    }
    const newGlyph = state.glyph.slice();
    newGlyph[lineIndex + 1] = state.glyph[lineIndex];
    newGlyph[lineIndex] = state.glyph[lineIndex + 1];
    return {
      ...state,
      glyph: newGlyph,
      selection: [lineIndex + 1],
    };
  })

  .case(editorActions.undo, (state) => state) // TODO
  .case(editorActions.redo, (state) => state) // TODO

  .case(editorActions.paste, (state) => ({
    ...state,
    glyph: state.glyph.concat(state.clipboard),
    selection: state.clipboard.map((_gLine, index) => state.glyph.length + index),
  }))
  .case(editorActions.copy, (state) => {
    const targetLines = state.selection.map((index) => state.glyph[index]);
    const [x1, y1] = getGlyphLinesBBX(targetLines);
    const tX = (x: number) => 230 + x - x1;
    const tY = (y: number) => 20 + y - y1;
    return {
      ...state,
      clipboard: state.selection.map((index) => (
        applyGlyphLineOperation(state.glyph[index], tX, tY)
      )),
    };
  })
  .case(editorActions.cut, (state) => ({
    ...state,
    glyph: state.glyph.filter((_gLine, index) => !state.selection.includes(index)),
    clipboard: state.selection.map((index) => state.glyph[index]),
    selection: [],
  }))

  .case(editorActions.decomposeSelected, (state) => {
    let newGlyph: Glyph = [];
    let newSelection: number[] = [];
    state.glyph.forEach((gLine, index) => {
      if (!state.selection.includes(index)) {
        newGlyph.push(gLine);
        return;
      }
      const newLines = decompose(gLine, state.buhinMap);
      newSelection = newSelection.concat(
        newLines.map((_gLine, subindex) => newGlyph.length + subindex)
      );
      newGlyph = newGlyph.concat(newLines);
    });
    return {
      ...state,
      glyph: newGlyph,
      selection: newSelection,
    };
  })

  .case(editorActions.toggleFreehand, (state) => ({
    ...state,
    selection: state.freehandMode ? state.selection : [],
    freehandMode: !state.freehandMode,
  }))

  .case(editorActions.openOptionModal, (state) => ({
    ...state,
    showOptionModal: true,
  }))
  .case(editorActions.closeOptionModal, (state) => ({
    ...state,
    showOptionModal: false,
  }));

export default editor;
