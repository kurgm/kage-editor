// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2022, 2023, 2025  kurgm

import React, { useRef, useEffect } from 'react';

import args, { gwHosts } from '../args';

import { useAppSelector } from '../hooks';
import { submitGlyphSelector } from '../selectors/submitGlyph';
import { unparseGlyph } from '../kageUtils/glyph';


// Recent browsers do not send cookies (without SameSite attribute) in cross-site POST requests
// for security reasons, which breaks GlyphWiki's session management.
// If the submission will be cross-site request, submit as a GET request; otherwise submit as
// a POST request to prevent the data loss due to a long URL (see issue #16).
const isGlyphWikiHost = (host: string) => gwHosts.includes(host);
const submitAsPost = isGlyphWikiHost(window.location.host) && isGlyphWikiHost(args.host);

const glyphName = args.name || 'sandbox';

const formAction = `${args.ssl ? 'https' : 'http'}://${args.host}/wiki/${encodeURIComponent(glyphName)}${submitAsPost ? '?action=preview' : ''}`;

const formStyle: React.CSSProperties = {
  visibility: 'hidden',
  position: 'absolute',
};

const SubmitForm = () => {
  const exitEvent = useAppSelector((state) => state.exitEvent);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (exitEvent) {
      formRef.current?.submit();
    }
  }, [exitEvent]);
  const glyph = useAppSelector(submitGlyphSelector);
  return (
    <form
      style={formStyle}
      ref={formRef}
      action={formAction}
      method={submitAsPost ? 'post' : 'get'}
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
