import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { editorActions, CTMInv } from '../actions/editor';
import GlyphArea from '../components/GlyphArea';
import { AppState } from '../reducers';
import { applyDraggingEffectToGlyph } from '../reducers/editor';

export interface GlyphAreaActions {
  handleMouseDownCapture: (evt: React.MouseEvent<SVGSVGElement>) => void;

  handleMouseDownBackground: (evt: React.MouseEvent) => void;
  handleMouseDownDeselectedStroke: (evt: React.MouseEvent, index: number) => void;
  handleMouseDownSelectedStroke: (evt: React.MouseEvent, index: number) => void;

  handleMouseMove: (evt: MouseEvent) => void;
  handleMouseUp: (evt: MouseEvent) => void;
};

const mapStateToProps = (state: AppState) => ({
  ...state.editor,
  glyph: applyDraggingEffectToGlyph(state.editor),
});

const mapDispatchToProps = (dispatch: Dispatch): GlyphAreaActions => ({
  handleMouseDownCapture: (evt: React.MouseEvent<SVGSVGElement>) => {
    const ctm = evt.currentTarget.getScreenCTM();
    if (!ctm) {
      return;
    }
    const pt = evt.currentTarget.createSVGPoint();
    const ctmInv: CTMInv = (evtx, evty) => {
      pt.x = evtx;
      pt.y = evty;
      const { x, y } = pt.matrixTransform(ctm.inverse());
      return [x, y];
    };
    dispatch(editorActions.updateCTMInv(ctmInv));
  },

  handleMouseDownBackground: (evt: React.MouseEvent) => {
    if (!(evt.shiftKey || evt.ctrlKey)) {
      dispatch(editorActions.selectNone());
    }
    dispatch(editorActions.startAreaSelect(evt));
  },
  handleMouseDownDeselectedStroke: (evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(editorActions.selectAddSingle(index));
    } else {
      dispatch(editorActions.selectSingle(index));
    }
    dispatch(editorActions.startSelectionDrag(evt));
    evt.stopPropagation();
  },
  handleMouseDownSelectedStroke: (evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(editorActions.selectRemoveSingle(index));
    }
    dispatch(editorActions.startSelectionDrag(evt));
    evt.stopPropagation();
  },

  handleMouseMove: (evt: MouseEvent) => {
    dispatch(editorActions.mouseMove(evt));
  },
  handleMouseUp: (evt: MouseEvent) => {
    dispatch(editorActions.mouseUp(evt));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GlyphArea);
