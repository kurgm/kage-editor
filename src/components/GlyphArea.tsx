import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../reducers';

import { selectActions } from '../actions/select';
import { dragActions, CTMInv } from '../actions/drag';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';

import XorMasks from './XorMasks';
import Grid from './Grid';
import Glyph from './Glyph';
import StrokeCenterLine from './StrokeCenterLine';
import SelectionControl from './SelectionControl';
import AreaSelectRect from './AreaSelectRect';

import './GlyphArea.css';

const GlyphArea = () => {
  const glyph = useSelector(draggedGlyphSelector);
  const buhinMap = useSelector((state: AppState) => state.buhinMap);
  const shotai = useSelector((state: AppState) => state.shotai);
  const xorMaskType = useSelector((state: AppState) => state.xorMaskType);
  const selection = useSelector((state: AppState) => state.selection);
  const areaSelectRect = useSelector((state: AppState) => state.areaSelectRect);
  const freehandMode = useSelector((state: AppState) => state.freehandMode);

  const svgClassName = freehandMode ? 'freehand' : '';

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
    dispatch(dragActions.startBackgroundDrag(evt));
    evt.preventDefault();
  }, [dispatch]);
  const handleMouseDownDeselectedStroke = useCallback((evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectAddSingle(index));
    } else {
      dispatch(selectActions.selectSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.preventDefault();
    evt.stopPropagation();
  }, [dispatch]);
  const handleMouseDownSelectedStroke = useCallback((evt: React.MouseEvent, index: number) => {
    if (evt.shiftKey || evt.ctrlKey) {
      dispatch(selectActions.selectRemoveSingle(index));
    }
    dispatch(dragActions.startSelectionDrag(evt));
    evt.preventDefault();
    evt.stopPropagation();
  }, [dispatch]);

  useEffect(() => {
    const handleMouseMove = (evt: MouseEvent) => {
      dispatch(dragActions.mouseMove(evt));
    };
    const handleMouseUp = (evt: MouseEvent) => {
      dispatch(dragActions.mouseUp(evt));
    };
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dispatch]);

  return (
    <div className="glyph-area">
      <svg
        width="100%" height="100%" viewBox="-20 -20 500 240"
        className={svgClassName}
        onMouseDownCapture={handleMouseDownCapture}
        onMouseDown={handleMouseDownBackground}
      >
        <defs>
          <XorMasks />
        </defs>
        <Grid />
        <rect x="0" y="0" width="200" height="200" className="glyph-boundary" />
        <rect x="12" y="12" width="176" height="176" className="glyph-guide" />
        <Glyph
          glyph={glyph}
          buhinMap={buhinMap}
          shotai={shotai}
          xorMaskType={xorMaskType}
          selection={selection}
          handleMouseDownDeselectedStroke={handleMouseDownDeselectedStroke}
          handleMouseDownSelectedStroke={handleMouseDownSelectedStroke}
        />
        <StrokeCenterLine />
        <SelectionControl />
        <AreaSelectRect rect={areaSelectRect} />
      </svg>
    </div>
  );
};

export default GlyphArea;
