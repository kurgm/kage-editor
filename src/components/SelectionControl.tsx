import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { createSelector } from 'reselect';

import { dragActions, RectPointPosition } from '../actions/drag';
import { AppState } from '../reducers';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { getMatchType, MatchType } from '../kageUtils/match';

import ControlPoint from './ControlPoint';

import './SelectionControl.css';

export interface RectControl {
  multiSelect: boolean;
  coords: [number, number, number, number];
}
export interface ControlPoint {
  x: number;
  y: number;
  className: string;
}

export interface SelectionControlState {
  rectControl: RectControl | null;
  pointControl: ControlPoint[];
}
const mapStateToProps = createSelector(
  [
    draggedGlyphSelector,
    (state: AppState) => state.selection,
  ],
  (glyph, selection): SelectionControlState => {
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
  const props = useSelector(mapStateToProps, shallowEqual);

  const dispatch = useDispatch();
  const handleMouseDownRectControl = useCallback((evt: React.MouseEvent, position: RectPointPosition) => {
    dispatch(dragActions.startResize([evt, position]));
    evt.stopPropagation();
  }, [dispatch]);

  const handleMouseDownPointControl = useCallback((evt: React.MouseEvent, pointIndex: number) => {
    dispatch(dragActions.startPointDrag([evt, pointIndex]));
    evt.stopPropagation();
  }, [dispatch]);

  return <>
    {props.rectControl && <>
      <rect
        className='selection-rect'
        x={props.rectControl.coords[0]}
        y={props.rectControl.coords[1]}
        width={props.rectControl.coords[2] - props.rectControl.coords[0]}
        height={props.rectControl.coords[3] - props.rectControl.coords[1]}
      />
      <ControlPoint
        x={(props.rectControl.coords[0] + props.rectControl.coords[2]) / 2}
        y={props.rectControl.coords[1]}
        className='north'
        handleMouseDown={(evt) => handleMouseDownRectControl(evt, RectPointPosition.north)}
      />
      <ControlPoint
        x={props.rectControl.coords[0]}
        y={(props.rectControl.coords[1] + props.rectControl.coords[3]) / 2}
        className='west'
        handleMouseDown={(evt) => handleMouseDownRectControl(evt, RectPointPosition.west)}
      />
      <ControlPoint
        x={(props.rectControl.coords[0] + props.rectControl.coords[2]) / 2}
        y={props.rectControl.coords[3]}
        className='south'
        handleMouseDown={(evt) => handleMouseDownRectControl(evt, RectPointPosition.south)}
      />
      <ControlPoint
        x={props.rectControl.coords[2]}
        y={(props.rectControl.coords[1] + props.rectControl.coords[3]) / 2}
        className='east'
        handleMouseDown={(evt) => handleMouseDownRectControl(evt, RectPointPosition.east)}
      />
      <ControlPoint
        x={props.rectControl.coords[2]}
        y={props.rectControl.coords[3]}
        className='southeast'
        handleMouseDown={(evt) => handleMouseDownRectControl(evt, RectPointPosition.southeast)}
      />
    </>}
    {props.pointControl.map(({ x, y, className }, index) => (
      <ControlPoint
        key={index}
        x={x} y={y}
        className={className}
        handleMouseDown={(evt) => handleMouseDownPointControl(evt, index)}
      />
    ))}
  </>;
};

export default SelectionControl;