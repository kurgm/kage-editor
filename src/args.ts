const args = new URLSearchParams(window.location.hash.slice(1));

let host = args.get('host');
let ssl = args.get('ssl') !== 'false';
const name = args.get('name');
const related = args.get('related') || 'u3013';
const edittime = args.get('edittime');
const data = args.get('data') || '';
const summary = args.get('summary') || '';

const gwHosts = [
  'glyphwiki.org',
  'en.glyphwiki.org',
  'ko.glyphwiki.org',
  'zhs.glyphwiki.org',
  'zht.glyphwiki.org',
  'non-ssl.glyphwiki.org',
];

if (!host && document.referrer) {
  try {
    const referrerUrl = new URL(document.referrer);
    if (gwHosts.includes(referrerUrl.host)) {
      host = referrerUrl.host;
      ssl = referrerUrl.protocol === 'https:';
    }
  } catch (e) {
  }
}

if (!host || !gwHosts.includes(host)) {
  host = 'glyphwiki.org';
}

export default {
  host,
  ssl,
  name,
  related,
  edittime,
  data,
  summary,
};
