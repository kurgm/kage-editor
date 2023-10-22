import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { ShowCenterLine } from '../actions/display';
import { AppState } from '../reducers';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import { decomposeDeep } from '../kageUtils/decompose';
import { GlyphLine } from '../kageUtils/glyph';

import './StrokeCenterLine.css';

const strokeCenterLineShownNumbersSelector = createSelector(
  [
    draggedGlyphSelector,
    (state: AppState) => state.showStrokeCenterLine,
    (state: AppState) => state.selection,
  ],
  (glyph, showStrokeCenterLine, selection): number[] => {
    switch (showStrokeCenterLine) {
      case ShowCenterLine.none:
        return [];
      case ShowCenterLine.selection: {
        if (selection.length !== 1) {
          return [];
        }
        const selectedGlyphLine = glyph[selection[0]];
        switch (selectedGlyphLine.value[0]) {
          case 0:
          case 9:
          case 99:
            return [];
          default:
            return selection;
        }
      }
      case ShowCenterLine.always:
        return glyph.map((_gLine, index) => index);
      default:
        // exhaustive?
        return ((_x: never) => _x)(showStrokeCenterLine);
    }
  }
);

const strokeCenterLineStrokesPerLinesSelector = createSelector(
  [
    draggedGlyphSelector,
    (state: AppState) => state.buhinMap,
    strokeCenterLineShownNumbersSelector,
  ],
  (glyph, buhinMap, glyphLineNumbers): GlyphLine[][] => (
    glyph.map((gLine, index) => glyphLineNumbers.includes(index) ? decomposeDeep(gLine, buhinMap) : [])
  )
);

const StrokeCenterLine = () => {
  const strokesPerLines = useSelector(strokeCenterLineStrokesPerLinesSelector);
  return (
    <g className="stroke-center-line">
      {strokesPerLines.map((strokesPerLine, lineIndex) => (
        <g key={lineIndex}>
          {strokesPerLine.map((stroke, strokeIndex) => {
            const v = stroke.value;
            switch (v[0]) {
              case 1:
                return <path key={strokeIndex} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]}`} />
              case 2:
                return <path key={strokeIndex} d={`M ${v[3]} ${v[4]} Q ${v[5]} ${v[6]} ${v[7]} ${v[8]}`} />
              case 3:
              case 4:
                return <path key={strokeIndex} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]} ${v[7]} ${v[8]}`} />
              case 6:
                return <path key={strokeIndex} d={`M ${v[3]} ${v[4]} C ${v[5]} ${v[6]} ${v[7]} ${v[8]} ${v[9]} ${v[10]}`} />
              case 7:
                return <path key={strokeIndex} d={`M ${v[3]} ${v[4]} ${v[5]} ${v[6]} Q ${v[7]} ${v[8]} ${v[9]} ${v[10]}`} />
              default:
                return null;
            }
          })}
        </g>
      ))}
    </g>
  );
};

export default StrokeCenterLine;
