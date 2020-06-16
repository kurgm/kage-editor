import { ReducerBuilder } from 'typescript-fsa-reducers';

import { editorActions } from '../actions/editor';

import { Glyph, GlyphLine } from '../kageUtils/glyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { decompose } from '../kageUtils/decompose';
import { calcStretchPositions, setStretchPositions } from '../kageUtils/stretchparam';
import { changeStrokeType } from '../kageUtils/stroketype';
import { applyGlyphLineOperation, moveSelectedGlyphLines } from '../kageUtils/transform';

import { AppState } from '.';

const setGlyphLine = (glyph: Glyph, index: number, glyphLine: GlyphLine): Glyph => {
  const newGlyph = glyph.slice();
  newGlyph[index] = glyphLine;
  return newGlyph;
};

export default (builder: ReducerBuilder<AppState>) => builder
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
    };
  })

  .case(editorActions.changeStrokeType, (state, newType) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    const newGLine = changeStrokeType(state.glyph[lineIndex], newType);
    return {
      ...state,
      glyph: setGlyphLine(state.glyph, lineIndex, newGLine),
    };
  })
  .case(editorActions.changeHeadShapeType, (state, newType) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    const newGLine: GlyphLine = {
      ...state.glyph[lineIndex],
      value: state.glyph[lineIndex].value.slice(),
    };
    newGLine.value[1] = newType;
    return {
      ...state,
      glyph: setGlyphLine(state.glyph, lineIndex, newGLine),
    };
  })
  .case(editorActions.changeTailShapeType, (state, newType) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    const newGLine: GlyphLine = {
      ...state.glyph[lineIndex],
      value: state.glyph[lineIndex].value.slice(),
    };
    newGLine.value[2] = newType;
    return {
      ...state,
      glyph: setGlyphLine(state.glyph, lineIndex, newGLine),
    };
  })
  .case(editorActions.changeStretchCoeff, (state, value) => {
    if (state.selection.length !== 1) {
      return state;
    }
    const lineIndex = state.selection[0];
    const selectedLine = state.glyph[lineIndex];
    if (!selectedLine.partName) {
      return state;
    }
    const stretchParam = state.stretchParamMap.get(selectedLine.partName);
    if (!stretchParam) {
      return state;
    }
    const newGLine = setStretchPositions(
      state.glyph[lineIndex],
      calcStretchPositions(stretchParam, value)
    );
    return {
      ...state,
      glyph: setGlyphLine(state.glyph, lineIndex, newGLine),
    };
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

  .case(editorActions.insertPart, (state, partName) => ({
    ...state,
    glyph: state.glyph.concat([{
      value: [99, 0, 0, 0, 0, 200, 200, 0, 0, 0, 0],
      partName,
    }]),
    selection: [state.glyph.length],
  }))

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
  .case(editorActions.delete, (state) => ({
    ...state,
    glyph: state.glyph.filter((_gLine, index) => !state.selection.includes(index)),
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
  .case(editorActions.moveSelected, (state, [dx, dy]) => ({
    ...state,
    glyph: moveSelectedGlyphLines(state.glyph, state.selection, dx, dy),
  }))

  .case(editorActions.toggleFreehand, (state) => ({
    ...state,
    selection: state.freehandMode ? state.selection : [],
    freehandMode: !state.freehandMode,
  }))

  .case(editorActions.escape, (state) => {
    if (state.showOptionModal) {
      return {
        ...state,
        showOptionModal: false,
      }
    }
    if (state.freehandMode) {
      return {
        ...state,
        freehandMode: false,
      };
    }
    if (state.selection.length) {
      return {
        ...state,
        selection: [],
      };
    }
    return state;
  })

  .case(editorActions.finishEdit, (state, evt) => ({
    ...state,
    exitEvent: evt,
  }));
