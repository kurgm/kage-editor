import { gwHosts } from "./args";

// Responses from GlyphWiki's API for glyphEditor lack headers required for cross-origin requests.
// We call GlyphWiki's API directly if it is same-origin (i.e. this app is deployed to GlyphWiki site),
// otherwise we call it via the reverse proxy that adds the 'Access-Control-Allow-Origin: *' header in the response.

const isSameOriginAPI = (
  ["http:", "https:"].includes(window.location.protocol) &&
  gwHosts.includes(window.location.host)
);

const apiUrlPrefix = isSameOriginAPI
  ? ''
  : 'https://asia-northeast1-ku6goma.cloudfunctions.net/gwproxy';

const callApi = async (path: string) => {
  const response = await fetch(apiUrlPrefix + path);
  if (!response.ok) {
    throw new Error('API error occurred');
  }
  return new URLSearchParams(await response.text());
};

export const getSource = async (name: string) => {
  const result = await callApi(`/get_source.cgi?name=${encodeURIComponent(name)}`);
  return result.get('data');
};

export const search = async (query: string) => {
  const result = await callApi(`/search4ge.cgi?query=${encodeURIComponent(query)}`);
  return result.get('data')!;
};

export const getCandidate = async (name: string) => {
  const result = await callApi(`/get_candidate.cgi?name=${encodeURIComponent(name)}`);
  return result.get('data')!;
};
