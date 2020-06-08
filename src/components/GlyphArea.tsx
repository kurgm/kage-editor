import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { AppState } from '../reducers';

import { selectActions } from '../actions/select';
import { dragActions, CTMInv } from '../actions/drag';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import Glyph from './Glyph';
import AreaSelectRect from './AreaSelectRect';
import SelectionControl from './SelectionControl';

import './GlyphArea.css';

const mapStateToProps = (state: AppState) => ({
  ...state,
  glyph: draggedGlyphSelector(state),
});

const GlyphArea = () => {
  const props = useSelector(mapStateToProps, shallowEqual);
  const dispatch = useDispatch();
  const handleMouseDownCapture = useCallback((evt: React.MouseEvent<SVGSVGElement>) => {
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
  }, [dispatch]);

  const handleMouseDownBackground = useCallback((evt: React.MouseEvent) => {
    if (!(evt.shiftKey || evt.ctrlKey)) {
      dispatch(selectActions.selectNone());
    }
    dispatch(dragActions.startAreaSelect(evt));
  }, [dispatch]);
  const handleMouseDownDeselectedStroke = useCallback((evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectAddSingle(index));
    } else {
      dispatch(selectActions.selectSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.stopPropagation();
  }, [dispatch]);
  const handleMouseDownSelectedStroke = useCallback((evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectRemoveSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.stopPropagation();
  }, [dispatch]);

  const handleMouseMove = useCallback((evt: MouseEvent) => {
    dispatch(dragActions.mouseMove(evt));
  }, [dispatch]);
  const handleMouseUp = useCallback((evt: MouseEvent) => {
    dispatch(dragActions.mouseUp(evt));
  }, [dispatch]);
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="glyph-area">
      <svg
        width="100%" height="100%" viewBox="-20 -20 500 240"
        onMouseDownCapture={handleMouseDownCapture}
        onMouseDown={handleMouseDownBackground}
      >
        {/* TODO: grid */}
        <rect x="0" y="0" width="200" height="200" className="glyph-boundary" />
        <rect x="12" y="12" width="176" height="176" className="glyph-guide" />
        <Glyph
          glyph={props.glyph}
          buhinMap={props.buhinMap}
          selection={props.selection}
          handleMouseDownDeselectedStroke={handleMouseDownDeselectedStroke}
          handleMouseDownSelectedStroke={handleMouseDownSelectedStroke}
        />
        <SelectionControl />
        <AreaSelectRect rect={props.areaSelectRect} />
      </svg>
    </div>
  );
};

export default GlyphArea;
