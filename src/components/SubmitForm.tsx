import React, { useRef, useLayoutEffect } from 'react';
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


const SubmitForm = () => {
  const exiting = useSelector((state: AppState) => state.exiting);
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (exiting) {
      formRef.current?.submit();
    }
  }, [exiting]);
  const glyph = useSelector(submitGlyphSelector);
  return (
    <form
      style={{ visibility: 'hidden', position: 'absolute' }}
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