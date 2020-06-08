import React from 'react';

import { RectPointPosition } from '../actions/drag';
import ControlPoint from './ControlPoint';

import { SelectionControlState, SelectionControlActions } from '../containers/SelectionControl';

import './SelectionControl.css';

interface OwnProps {
}

type SelectionControlProps = OwnProps & SelectionControlState & SelectionControlActions;

const SelectionControl = (props: SelectionControlProps) => (
  <>
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
        handleMouseDown={(evt) => props.handleMouseDownRectControl(evt, RectPointPosition.north)}
      />
      <ControlPoint
        x={props.rectControl.coords[0]}
        y={(props.rectControl.coords[1] + props.rectControl.coords[3]) / 2}
        className='west'
        handleMouseDown={(evt) => props.handleMouseDownRectControl(evt, RectPointPosition.west)}
      />
      <ControlPoint
        x={(props.rectControl.coords[0] + props.rectControl.coords[2]) / 2}
        y={props.rectControl.coords[3]}
        className='south'
        handleMouseDown={(evt) => props.handleMouseDownRectControl(evt, RectPointPosition.south)}
      />
      <ControlPoint
        x={props.rectControl.coords[2]}
        y={(props.rectControl.coords[1] + props.rectControl.coords[3]) / 2}
        className='east'
        handleMouseDown={(evt) => props.handleMouseDownRectControl(evt, RectPointPosition.east)}
      />
      <ControlPoint
        x={props.rectControl.coords[2]}
        y={props.rectControl.coords[3]}
        className='southeast'
        handleMouseDown={(evt) => props.handleMouseDownRectControl(evt, RectPointPosition.southeast)}
      />
    </>}
    {props.pointControl.map(({ x, y, className }, index) => (
      <ControlPoint
        key={index}
        x={x} y={y}
        className={className}
        handleMouseDown={(evt) => props.handleMouseDownPointControl(evt, index)}
      />
    ))}
  </>
);

export default SelectionControl;