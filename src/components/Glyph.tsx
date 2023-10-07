import React from 'react';

import { Glyph } from '../kageUtils/glyph';
import { makeGlyphSeparated, KShotai } from '../kage';
import { XorMaskType } from '../xorMask';

import Stroke from './Stroke';

import './Glyph.css'

export interface GlyphComponentProps {
  glyph: Glyph;
  buhinMap: Map<string, string>;
  selection: number[];
  shotai: KShotai;
  xorMaskType: XorMaskType;
  handleMouseDownDeselectedStroke?: (evt: React.MouseEvent, index: number) => void;
  handleMouseDownSelectedStroke?: (evt: React.MouseEvent, index: number) => void;
  makeGlyphSeparated?: typeof makeGlyphSeparated;
}

const GlyphComponent = (props: GlyphComponentProps) => {
  const polygonsSep = (props.makeGlyphSeparated || makeGlyphSeparated)(props.glyph, props.buhinMap, props.shotai);

  const { selection } = props;
  const nonSelection = polygonsSep.map((_polygons, index) => index)
    .filter((index) => !selection.includes(index));

  return (
    <>
      <g className="strokes-deselected">
        {nonSelection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownDeselectedStroke?.(evt, index)}>
            <Stroke
              polygons={polygonsSep[index]}
              className={props.handleMouseDownDeselectedStroke ? "movable-stroke" : ""}
            />
          </g>
        ))}
      </g>
      {props.xorMaskType !== "none" && <>
        <use xlinkHref={`#xormask_${props.xorMaskType}`} className="xormask-fill" />
        <clipPath id="xorMaskClip">
          <use xlinkHref={`#xormask_${props.xorMaskType}`} />
        </clipPath>
        <g clipPath="url(#xorMaskClip)" className="strokes-invert">
          {nonSelection.map((index) => (
            <g key={index}>
              <Stroke polygons={polygonsSep[index]} />
            </g>
          ))}
        </g>
      </>}
      <g className="strokes-selected">
        {selection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownSelectedStroke?.(evt, index)}>
            <Stroke
              polygons={polygonsSep[index]}
              className={props.handleMouseDownSelectedStroke ? "movable-stroke" : ""}
            />
          </g>
        ))}
      </g>
    </>
  );
};

export default GlyphComponent;
