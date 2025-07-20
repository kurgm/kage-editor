// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2021, 2023, 2025  kurgm and graphemecluster

import React, { useCallback, useMemo } from 'react';

import { dragActions, RectPointPosition } from '../actions/drag';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createAppSelector } from '../selectors/util';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import { getGlyphLinesBBX } from '../kageUtils/bbx';
import { getMatchType, MatchType } from '../kageUtils/match';

import ControlPoint from './ControlPoint';

import './SelectionControl.css';

interface RectControl {
  multiSelect: boolean;
  coords: [number, number, number, number];
}
interface ControlPointSpec {
  x: number;
  y: number;
  matchType: MatchType;
}

interface SelectionControlSpec {
  rectControl: RectControl | null;
  pointControl: ControlPointSpec[];
  auxiliaryLines: [number, number, number, number][];
}
const selectionControlSelector = createAppSelector(
  [
    draggedGlyphSelector,
    (state) => state.selection,
  ],
  (glyph, selection): SelectionControlSpec => {
    if (selection.length === 0) {
      return { rectControl: null, pointControl: [], auxiliaryLines: [] };
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
        auxiliaryLines: [],
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
          auxiliaryLines: [],
        };
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 7: {
        const pointControl: ControlPointSpec[] = [];
        for (let i = 3; i + 2 <= selectedStroke.value.length; i += 2) {
          const matchType = getMatchType(glyph, {
            lineIndex: selection[0],
            pointIndex: (i - 3) / 2,
          });
          pointControl.push({
            x: selectedStroke.value[i],
            y: selectedStroke.value[i + 1],
            matchType,
          });
        }

        const auxiliaryLines: [number, number, number, number][] = [];
        if (selectedStroke.value[0] === 2 || selectedStroke.value[0] === 6) {
          auxiliaryLines.push([
            selectedStroke.value[3],
            selectedStroke.value[4],
            selectedStroke.value[5],
            selectedStroke.value[6],
          ]);
        }
        if (selectedStroke.value[0] === 2 || selectedStroke.value[0] === 7) {
          auxiliaryLines.push([
            selectedStroke.value[5],
            selectedStroke.value[6],
            selectedStroke.value[7],
            selectedStroke.value[8],
          ]);
        }
        if (selectedStroke.value[0] === 6 || selectedStroke.value[0] === 7) {
          auxiliaryLines.push([
            selectedStroke.value[7],
            selectedStroke.value[8],
            selectedStroke.value[9],
            selectedStroke.value[10],
          ]);
        }
        return { rectControl: null, pointControl, auxiliaryLines };
      }
      default:
        return { rectControl: null, pointControl: [], auxiliaryLines: [] };
    }
  }
);

const SelectionControl = () => {
  const { rectControl, pointControl, auxiliaryLines } = useAppSelector(selectionControlSelector);

  const dispatch = useAppDispatch();
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
  const handleMouseDownSouthwestPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.southwest),
    [handleMouseDownRectControl]
  );
  const handleMouseDownNortheastPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.northeast),
    [handleMouseDownRectControl]
  );
  const handleMouseDownNorthwestPoint = useCallback(
    (evt: React.MouseEvent) => handleMouseDownRectControl(evt, RectPointPosition.northwest),
    [handleMouseDownRectControl]
  );

  const handleMouseDownPointControls = useMemo(() => {
    return pointControl.map((_control, pointIndex) => (evt: React.MouseEvent) => {
      dispatch(dragActions.startPointDrag([evt, pointIndex]));
      evt.stopPropagation();
    });
  }, [dispatch, pointControl]);

  const verticallyFlipped = !!rectControl && rectControl.coords[0] > rectControl.coords[2];
  const horizontallyFlipped = !!rectControl && rectControl.coords[1] > rectControl.coords[3];
  const rectCornerFlipped = verticallyFlipped !== horizontallyFlipped;

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
        cursorType='ns-resize'
        handleMouseDown={handleMouseDownNorthPoint}
      />
      <ControlPoint
        x={rectControl.coords[0]}
        y={(rectControl.coords[1] + rectControl.coords[3]) / 2}
        cursorType='ew-resize'
        handleMouseDown={handleMouseDownWestPoint}
      />
      <ControlPoint
        x={(rectControl.coords[0] + rectControl.coords[2]) / 2}
        y={rectControl.coords[3]}
        cursorType='ns-resize'
        handleMouseDown={handleMouseDownSouthPoint}
      />
      <ControlPoint
        x={rectControl.coords[2]}
        y={(rectControl.coords[1] + rectControl.coords[3]) / 2}
        cursorType='ew-resize'
        handleMouseDown={handleMouseDownEastPoint}
      />
      <ControlPoint
        x={rectControl.coords[2]}
        y={rectControl.coords[3]}
        cursorType={rectCornerFlipped ? 'nesw-resize' : 'nwse-resize'}
        handleMouseDown={handleMouseDownSoutheastPoint}
      />
      <ControlPoint
        x={rectControl.coords[0]}
        y={rectControl.coords[3]}
        cursorType={rectCornerFlipped ? 'nwse-resize' : 'nesw-resize'}
        handleMouseDown={handleMouseDownSouthwestPoint}
      />
      <ControlPoint
        x={rectControl.coords[2]}
        y={rectControl.coords[1]}
        cursorType={rectCornerFlipped ? 'nwse-resize' : 'nesw-resize'}
        handleMouseDown={handleMouseDownNortheastPoint}
      />
      <ControlPoint
        x={rectControl.coords[0]}
        y={rectControl.coords[1]}
        cursorType={rectCornerFlipped ? 'nesw-resize' : 'nwse-resize'}
        handleMouseDown={handleMouseDownNorthwestPoint}
      />
    </>}
    {auxiliaryLines.map((points, index) => (
      <path className="auxiliary-lines" key={index} d={'M ' + points.join(' ')} />
    ))}
    {pointControl.map(({ x, y, matchType }, index) => (
      <ControlPoint
        key={index}
        x={x} y={y}
        matchType={matchType}
        handleMouseDown={handleMouseDownPointControls[index]}
      />
    ))}
  </>;
};

export default SelectionControl;
