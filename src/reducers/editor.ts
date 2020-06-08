import { ReducerBuilder } from 'typescript-fsa-reducers';

import { editorActions } from '../actions/editor';

import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { Glyph } from '../kageUtils/glyph';
import { applyGlyphLineOperation } from '../kageUtils/transform';
import { decompose } from '../kageUtils/decompose';

import { AppState } from '.';

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
