// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import clsx from 'clsx/lite';
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
  translucentXorMask?: boolean;
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
      <g className="strokesDeselected">
        {nonSelection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownDeselectedStroke?.(evt, index)}>
            <Stroke
              polygons={polygonsSep[index]}
              className={clsx(props.handleMouseDownDeselectedStroke && 'movableStroke')}
            />
          </g>
        ))}
      </g>
      {props.xorMaskType !== "none" && <>
        <use
          xlinkHref={`#xormask_${props.xorMaskType}`}
          className={clsx("xormaskFill", props.translucentXorMask && 'translucent')}
        />
        <clipPath id="xorMaskClip">
          <use xlinkHref={`#xormask_${props.xorMaskType}`} />
        </clipPath>
        <g clipPath="url(#xorMaskClip)" className="strokesInvert">
          {nonSelection.map((index) => (
            <g key={index}>
              <Stroke polygons={polygonsSep[index]} />
            </g>
          ))}
        </g>
      </>}
      <g className="strokesSelected">
        {selection.map((index) => (
          <g key={index} onMouseDown={(evt) => props.handleMouseDownSelectedStroke?.(evt, index)}>
            <Stroke
              polygons={polygonsSep[index]}
              className={clsx(props.handleMouseDownSelectedStroke && 'movableStroke')}
            />
          </g>
        ))}
      </g>
    </>
  );
};

export default GlyphComponent;
