import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { editorActions } from '../actions/editor';
import { search } from '../callapi';
import args from '../args';

import './PartsSearch.css';

const searchSuggestions = [
  'エディタ部品1',
  'エディタ部品2',
  'エディタ部品3',
  'エディタ部品4',
];

const getImageURL = (name: string) => (
  `https://glyphwiki.org/glyph/${name}.50px.png`
);

class QueryTooShortError extends Error { }

const PartsSearch = () => {
  const queryInputRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [err, setErr] = useState<any>(null);

  const startSearch = (query: string) => {
    setSearching(true);
    search(query)
      .then((result) => {
        if (result === 'tooshort') {
          throw new QueryTooShortError('query too short');
        }
        if (result === 'nodata') {
          return [];
        }
        return result.split('\t');
      })
      .then((names) => {
        setSearching(false);
        setNames(names);
      })
      .catch((reason) => {
        setSearching(false);
        setErr(reason);
      });
  };

  useEffect(() => {
    const query = args.get('name');
    if (query) {
      startSearch(query);
    }
  }, []);
  const handleSearch = useCallback(() => {
    if (!queryInputRef.current) {
      return;
    }
    const query = queryInputRef.current.value;
    startSearch(query);
  }, []);

  const hoverNameRef = useRef<HTMLDivElement>(null);
  const handleImageMouseEnter = useCallback((evt: React.MouseEvent<HTMLImageElement>) => {
    if (!hoverNameRef.current) {
      return;
    }
    const partName = evt.currentTarget.dataset.name!;
    hoverNameRef.current.textContent = partName;
  }, []);
  const dispatch = useDispatch();
  const handleImageClick = useCallback((evt: React.MouseEvent<HTMLImageElement>) => {
    const partName = evt.currentTarget.dataset.name!;
    dispatch(editorActions.insertPart(partName));
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="parts-search-area">
      <div className="parts-search-box">
        <input defaultValue={args.get('name') || ''} list="searchList" ref={queryInputRef} />
        <button onClick={handleSearch}>
          {t('search')}
        </button>
        <datalist id="searchList">
          {searchSuggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      </div>
      <div className="parts-list">
        {searching
          ? t('searching')
          : err
            ? err instanceof QueryTooShortError
              ? t('search query too short')
              : t('search error', { message: err })
            : names.length === 0
              ? t('no search result')
              : names.map((name) => (
                <img
                  key={name} alt={name} title={name}
                  data-name={name}
                  src={getImageURL(name)}
                  width={50} height={50}
                  onClick={handleImageClick}
                  onMouseEnter={handleImageMouseEnter}
                />
              ))}
      </div>
      <div className="parts-hover-name" ref={hoverNameRef}>&nbsp;</div>
    </div>
  )
};

export default PartsSearch;
