import React from 'react';

import './ControlPoint.css';

interface ControlPointProps {
  x: number;
  y: number;
  className?: string;
  handleMouseDown: (evt: React.MouseEvent) => void;
}

const ControlPoint = (props: ControlPointProps) => (
  <rect
    x={props.x - 4}
    y={props.y - 4}
    width={8} height={8}
    className={`controlpoint-rect ${props.className || ''}`}
    onMouseDown={props.handleMouseDown}
  />
);

export default ControlPoint;
