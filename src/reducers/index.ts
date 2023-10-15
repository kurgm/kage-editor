import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { ShowCenterLine } from '../actions/display';
import { RectPointPosition, CTMInv } from '../actions/drag';

import { GlyphLine, Glyph, parseGlyph } from '../kageUtils/glyph';
import { StretchParam } from '../kageUtils/stretchparam';
import args from '../args';
import type { KShotai } from '../kage';

import select from './select';
import drag from './drag';
import editor from './editor';
import display, { GridState } from './display';

import { undoable } from './undo';
import { XorMaskType } from '../xorMask';

export interface AppState {
  glyph: Glyph;
  selection: number[];

  areaSelectRect: [number, number, number, number] | null;
  dragSelection: [number, number, number, number] | null;
  dragPoint: [number, [number, number, number, number]] | null;
  resizeSelection: [RectPointPosition, [number, number, number, number]] | null;
  freehandStroke: [number, number][] | null;
  ctmInv: CTMInv | null;
  freehandMode: boolean;

  buhinMap: Map<string, string>;
  stretchParamMap: Map<string, StretchParam>;
  clipboard: GlyphLine[];
  undoStacks: {
    undo: Glyph[];
    redo: Glyph[];
  };
  exitEvent: Event | null;

  showOptionModal: boolean;
  grid: GridState;
  showStrokeCenterLine: ShowCenterLine;
  shotai: KShotai;
  xorMaskType: XorMaskType;
}

const initialState: AppState = {
  glyph: parseGlyph(args.data),
  selection: [],

  areaSelectRect: null,
  dragSelection: null,
  dragPoint: null,
  resizeSelection: null,
  freehandStroke: null,
  ctmInv: null,
  freehandMode: false,

  buhinMap: new Map<string, string>(),
  stretchParamMap: new Map<string, StretchParam>(),
  clipboard: [],
  undoStacks: { undo: [], redo: [] },
  exitEvent: null,

  showOptionModal: false,
  grid: {
    display: true,
    originX: 0,
    originY: 0,
    spacingX: 20,
    spacingY: 20,
  },
  showStrokeCenterLine: ShowCenterLine.selection,
  shotai: 0, // KShotai.kMincho
  xorMaskType: "none",
};

const reducer = undoable(
  reducerWithInitialState(initialState)
    .withHandling(select)
    .withHandling(drag)
    .withHandling(editor)
    .withHandling(display)
);

export default reducer;
