// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import { useAppSelector } from '../hooks';
import { submitGlyphSelector } from '../selectors/submitGlyph';
import { makeGlyphSeparatedForSubmit } from '../kage';

import GlyphComponent from './Glyph';

const SubmitPreview = () => {
  const submitGlyph = useAppSelector(submitGlyphSelector);
  const buhinMap = useAppSelector((state) => state.buhinMap);
  const shotai = useAppSelector((state) => state.shotai);
  const xorMaskType = useAppSelector((state) => state.xorMaskType);

  return (
    <svg className="preview-thumbnail" viewBox="0 0 200 200" width="50" height="50">
      <GlyphComponent
        buhinMap={buhinMap}
        glyph={submitGlyph}
        shotai={shotai}
        xorMaskType={xorMaskType}
        selection={[]}
        makeGlyphSeparated={makeGlyphSeparatedForSubmit}
      />
    </svg>
  );
};

export default SubmitPreview;
