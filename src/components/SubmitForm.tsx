import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import args from '../args';

import { AppState } from '../reducers';
import { submitGlyphSelector } from '../selectors/submitGlyph';
import { unparseGlyph } from '../kageUtils/glyph';


let host = args.get('host');
const ssl = args.get('ssl') !== 'false';
const glyphName = args.get('name') || 'sandbox';
const related = args.get('related') || 'u3013';
const edittime = args.get('edittime');
const summary = args.get('summary') || '';

if (!host || ![
  'glyphwiki.org',
  'en.glyphwiki.org',
  'ko.glyphwiki.org',
  'zhs.glyphwiki.org',
  'zht.glyphwiki.org',
].includes(host)) {
  host = 'glyphwiki.org';
}

const formAction = `${ssl ? 'https' : 'http'}://${host}/wiki/${encodeURIComponent(glyphName)}?action=preview`;

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
      <input type="hidden" name="related" value={related} />
      <input type="hidden" name="summary" value={summary} />
      {edittime && <input type="hidden" name="edittime" value={edittime} />}
    </form>
  );
};

export default SubmitForm;