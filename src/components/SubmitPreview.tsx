import React from 'react';
import { useSelector } from 'react-redux';

import { submitGlyphSelector } from '../selectors/submitGlyph';
import { AppState } from '../reducers';
import { makeGlyphSeparatedForSubmit } from '../kage';

import GlyphComponent from './Glyph';

const SubmitPreview = () => {
  const submitGlyph = useSelector(submitGlyphSelector);
  const buhinMap = useSelector((state: AppState) => state.buhinMap);
  const shotai = useSelector((state: AppState) => state.shotai);

  return (
    <svg className="preview-thumbnail" viewBox="0 0 200 200" width="50" height="50">
      <GlyphComponent
        buhinMap={buhinMap}
        glyph={submitGlyph}
        shotai={shotai}
        selection={[]}
        makeGlyphSeparated={makeGlyphSeparatedForSubmit}
      />
    </svg>
  );
};

export default SubmitPreview;
