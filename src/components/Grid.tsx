import { useSelector } from 'react-redux';

import { AppState } from '../reducers';

import './Grid.css';

const Grid = () => {
  const grid = useSelector((state: AppState) => state.grid);
  if (!grid.display) {
    return <></>;
  }
  const xs = [];
  for (let x = grid.originX; x < 200; x += grid.spacingX) {
    xs.push(x);
  }
  const ys = [];
  for (let y = grid.originY; y < 200; y += grid.spacingY) {
    ys.push(y);
  }
  return (
    <g className="grid-lines">
      {xs.map((x) => (
        <path
          key={x}
          d={`M ${x} 0 V 200`}
        />
      ))}
      {ys.map((y) => (
        <path
          key={y}
          d={`M 0 ${y} H 200`}
        />
      ))}
    </g>
  );
};

export default Grid;
