import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createSelector } from 'reselect';

import { dragActions, RectPointPosition } from '../actions/drag';
import { AppState } from '../reducers';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { getMatchType, MatchType } from '../kageUtils/match';

import ControlPoint from './ControlPoint';

import './SelectionControl.css';

interface RectControl {
  multiSelect: boolean;
  coords: [number, number, number, number];
}
interface ControlPoint {
  x: number;
  y: number;
  className: string;
}

interface SelectionControlSpec {
  rectControl: RectControl | null;
  pointControl: ControlPoint[];
}

const selectionControlSelector = createSelector(
  [
    draggedGlyphSelector,
    (state: AppState) => state.selection,
  ],
  (glyph, selection): SelectionControlSpec => {
    if (selection.length === 0) {
      return { rectControl: null, pointControl: [] };
    }
    if (selection.length > 1) {
      const selectedStrokes = selection.map((index) => glyph[index]);
      const bbx = getGlyphLinesBBX(selectedStrokes);
      return {
        rectControl: {
          multiSelect: true,
          coords: bbx,
        },
        pointControl: [],
      };
    }
    const selectedStroke = glyph[selection[0]];
    switch (selectedStroke.value[0]) {
      case 0:
      case 9:
      case 99:
        return {
          rectControl: {
            multiSelect: false,
            coords: [
              selectedStroke.value[3],
              selectedStroke.value[4],
              selectedStroke.value[5],
              selectedStroke.value[6],
            ],
          },
          pointControl: [],
        };
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 7: {
        const pointControl: ControlPoint[] = [];
        for (let i = 3; i + 2 <= selectedStroke.value.length; i += 2) {
          const matchType = getMatchType(glyph, {
            lineIndex: selection[0],
            pointIndex: (i - 3) / 2,
          });
          let className = '';
          if (matchType === MatchType.match) {
              className = 'match';
          } else if (matchType === MatchType.online) {
              className = 'online';
          }

          pointControl.push({
            x: selectedStroke.value[i],
            y: selectedStroke.value[i + 1],
            className,
          });
        }
        return { rectControl: null, pointControl };
      }
      default:
        return { rectControl: null, pointControl: [] };
    }
  }
);

const SelectionControl = () => {
  const { rectControl, pointControl } = useSelector(selectionControlSelector);

  const dispatch = useDispatch();
  const handleMouseDownRectControl = useCallback((evt: React.MouseEvent, position: RectPointPosition) => {
    dispatch(dragActions.startResize([evt, position]));
    evt.stopPropagation();
  }, [dispatch]);

  const handleMouseDownNorthPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.north),
    [handleMouseDownRectControl]
  );
  const handleMouseDownWestPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.west),
    [handleMouseDownRectControl]
  );
  const handleMouseDownSouthPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.south),
    [handleMouseDownRectControl]
  );
  const handleMouseDownEastPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.east),
    [handleMouseDownRectControl]
  );
  const handleMouseDownSoutheastPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.southeast),
    [handleMouseDownRectControl]
  );

  const handleMouseDownPointControls = useMemo(() => {
    return pointControl.map((_control, pointIndex) => (evt: React.MouseEvent) => {
      dispatch(dragActions.startPointDrag([evt, pointIndex]));
      evt.stopPropagation();
    });
  }, [dispatch, pointControl]);

  return <>
    {rectControl && <>
      <rect
        className='selection-rect'
        x={Math.min(rectControl.coords[0], rectControl.coords[2])}
        y={Math.min(rectControl.coords[1], rectControl.coords[3])}
        width={Math.abs(rectControl.coords[2] - rectControl.coords[0])}
        height={Math.abs(rectControl.coords[3] - rectControl.coords[1])}
      />
      <ControlPoint
        x={(rectControl.coords[0] + rectControl.coords[2]) / 2}
        y={rectControl.coords[1]}
        className='north'
        handleMouseDown={handleMouseDownNorthPoint}
      />
      <ControlPoint
        x={rectControl.coords[0]}
        y={(rectControl.coords[1] + rectControl.coords[3]) / 2}
        className='west'
        handleMouseDown={handleMouseDownWestPoint}
      />
      <ControlPoint
        x={(rectControl.coords[0] + rectControl.coords[2]) / 2}
        y={rectControl.coords[3]}
        className='south'
        handleMouseDown={handleMouseDownSouthPoint}
      />
      <ControlPoint
        x={rectControl.coords[2]}
        y={(rectControl.coords[1] + rectControl.coords[3]) / 2}
        className='east'
        handleMouseDown={handleMouseDownEastPoint}
      />
      <ControlPoint
        x={rectControl.coords[2]}
        y={rectControl.coords[3]}
        className='southeast'
        handleMouseDown={handleMouseDownSoutheastPoint}
      />
    </>}
    {pointControl.map(({ x, y, className }, index) => (
      <ControlPoint
        key={index}
        x={x} y={y}
        className={className}
        handleMouseDown={handleMouseDownPointControls[index]}
      />
    ))}
  </>;
};

export default SelectionControl;