// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import { Glyph } from '../kageUtils/glyph';
import { getGlyphLineBBX } from '../kageUtils/bbx';

import { draggedGlyphSelector } from './draggedGlyph';
import { createAppSelector } from './util';

export const submitGlyphSelector = createAppSelector([
  draggedGlyphSelector,
], (glyph: Glyph): Glyph => {
  return glyph.filter((glyphLine) => getGlyphLineBBX(glyphLine)[0] < 200);
});
