import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import args from '../args';

import { AppState } from '../reducers';
import { submitGlyphSelector } from '../selectors/submitGlyph';
import { unparseGlyph } from '../kageUtils/glyph';


const glyphName = args.name || 'sandbox';

const formAction = `${args.ssl ? 'https' : 'http'}://${args.host}/wiki/${encodeURIComponent(glyphName)}?action=preview`;

const formStyle: React.CSSProperties = {
  visibility: 'hidden',
  position: 'absolute',
};

const SubmitForm = () => {
  const exitEvent = useSelector((state: AppState) => state.exitEvent);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (exitEvent) {
      formRef.current?.submit();
    }
  }, [exitEvent]);
  const glyph = useSelector(submitGlyphSelector);
  return (
    <form
      style={formStyle}
      ref={formRef}
      action={formAction}
      method="post"
    >
      <input type="hidden" name="page" value={glyphName} />
      <input type="hidden" name="action" value="preview" />
      <input type="hidden" name="textbox" value={unparseGlyph(glyph)} />
      <input type="hidden" name="related" value={args.related} />
      <input type="hidden" name="summary" value={args.summary} />
      {args.edittime && <input type="hidden" name="edittime" value={args.edittime} />}
    </form>
  );
};

export default SubmitForm;