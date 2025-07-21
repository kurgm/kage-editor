// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm


import { ShowCenterLine } from '../actions/display';
import { useAppSelector } from '../hooks';
import { createAppSelector } from '../selectors/util';
import { draggedGlyphSelector } from '../selectors/draggedGlyph';
import { decomposeDeep } from '../kageUtils/decompose';
import { GlyphLine } from '../kageUtils/glyph';

import styles from './StrokeCenterLine.module.css';

const strokeCenterLineShownNumbersSelector = createAppSelector(
  [
    draggedGlyphSelector,
    (state) => state.showStrokeCenterLine,
    (state) => state.selection,
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
    }
  }
);

const strokeCenterLineStrokesPerLinesSelector = createAppSelector(
  [
    draggedGlyphSelector,
    (state) => state.buhinMap,
    strokeCenterLineShownNumbersSelector,
  ],
  (glyph, buhinMap, glyphLineNumbers): GlyphLine[][] => (
    glyph.map((gLine, index) => glyphLineNumbers.includes(index) ? decomposeDeep(gLine, buhinMap) : [])
  )
);

const StrokeCenterLine = () => {
  const strokesPerLines = useAppSelector(strokeCenterLineStrokesPerLinesSelector);
  return (
    <g className={styles.strokeCenterLine}>
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
