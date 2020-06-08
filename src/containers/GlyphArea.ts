import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { selectActions } from '../actions/select';
import { dragActions, CTMInv } from '../actions/drag';
import GlyphArea from '../components/GlyphArea';
import { AppState } from '../reducers';
import { applyDraggingEffectToGlyph } from '../reducers';

export interface GlyphAreaActions {
  handleMouseDownCapture: (evt: React.MouseEvent<SVGSVGElement>) => void;

  handleMouseDownBackground: (evt: React.MouseEvent) => void;
  handleMouseDownDeselectedStroke: (evt: React.MouseEvent, index: number) => void;
  handleMouseDownSelectedStroke: (evt: React.MouseEvent, index: number) => void;

  handleMouseMove: (evt: MouseEvent) => void;
  handleMouseUp: (evt: MouseEvent) => void;
};

const mapStateToProps = (state: AppState) => ({
  ...state,
  glyph: applyDraggingEffectToGlyph(state),
});

const mapDispatchToProps = (dispatch: Dispatch): GlyphAreaActions => ({
  handleMouseDownCapture: (evt: React.MouseEvent<SVGSVGElement>) => {
    const ctm = evt.currentTarget.getScreenCTM();
    if (!ctm) {
      return;
    }
    const pt = evt.currentTarget.createSVGPoint();
    const ictm = ctm.inverse();
    const ctmInv: CTMInv = (evtx, evty) => {
      pt.x = evtx;
      pt.y = evty;
      const { x, y } = pt.matrixTransform(ictm);
      return [x, y];
    };
    dispatch(dragActions.updateCTMInv(ctmInv));
  },

  handleMouseDownBackground: (evt: React.MouseEvent) => {
    if (!(evt.shiftKey || evt.ctrlKey)) {
      dispatch(selectActions.selectNone());
    }
    dispatch(dragActions.startAreaSelect(evt));
  },
  handleMouseDownDeselectedStroke: (evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectAddSingle(index));
    } else {
      dispatch(selectActions.selectSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.stopPropagation();
  },
  handleMouseDownSelectedStroke: (evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectRemoveSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.stopPropagation();
  },

  handleMouseMove: (evt: MouseEvent) => {
    dispatch(dragActions.mouseMove(evt));
  },
  handleMouseUp: (evt: MouseEvent) => {
    dispatch(dragActions.mouseUp(evt));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GlyphArea);
