import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { RectPointPosition, CTMInv } from '../actions/drag';

import { GlyphLine, Glyph, parseGlyph } from '../kageUtils/glyph';
import { StretchParam } from '../kageUtils/stretchparam';
import args from '../args';

import select from './select';
import drag from './drag';
import editor from './editor';
import { undoReduceBuilder as undo } from './undo';


export interface AppState {
  glyph: Glyph;
  selection: number[];
  areaSelectRect: [number, number, number, number] | null;
  dragSelection: [number, number, number, number] | null;
  dragPoint: [number, [number, number, number, number]] | null;
  resizeSelection: [RectPointPosition, [number, number, number, number]] | null;
  ctmInv: CTMInv | null;
  buhinMap: Map<string, string>;
  stretchParamMap: Map<string, StretchParam>;
  freehandMode: boolean;
  showOptionModal: boolean;
  clipboard: GlyphLine[];
  undoStacks: {
    undo: Glyph[];
    redo: Glyph[];
  };
}

const initialState: AppState = {
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
  undoStacks: { undo: [], redo: [] },
};

const reducer = reducerWithInitialState(initialState)
  .withHandling(select)
  .withHandling(drag)
  .withHandling(editor)
  .withHandling(undo);

export default reducer;
