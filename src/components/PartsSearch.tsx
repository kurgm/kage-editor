import React, { useRef, useCallback, useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { editorActions } from '../actions/editor';
import { search } from '../callapi';
import args from '../args';

import './PartsSearch.css';
import PartsList from './PartsList';

const searchSuggestions = [
  'エディタ部品1',
  'エディタ部品2',
  'エディタ部品3',
  'エディタ部品4',
];

const initialQuery = args.get('name') || '';

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
    if (initialQuery) {
      startSearch(initialQuery);
    }
  }, []);
  const handleSearch = useCallback(() => {
    if (!queryInputRef.current) {
      return;
    }
    const query = queryInputRef.current.value;
    if (!query) {
      setNames([]);
      return;
    }
    startSearch(query);
  }, []);
  const handleFormSubmit = useCallback((evt: React.FormEvent) => {
    evt.preventDefault();
    handleSearch();
  }, [handleSearch]);

  const hoverNameRef = useRef<HTMLDivElement>(null);
  const handleItemMouseEnter = useCallback((partName: string) => {
    if (!hoverNameRef.current) {
      return;
    }
    hoverNameRef.current.textContent = partName;
  }, []);
  const dispatch = useDispatch();
  const handleItemClick = useCallback((partName: string) => {
    dispatch(editorActions.insertPart(partName));
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="parts-search-area">
      <form className="parts-search-box" onSubmit={handleFormSubmit}>
        <input defaultValue={initialQuery} list="searchList" ref={queryInputRef} />
        <button onClick={handleSearch}>
          {t('search')}
        </button>
        <datalist id="searchList">
          {searchSuggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      </form>
      <div className="parts-list-area">
        {searching
          ? <div className="message">{t('searching')}</div>
          : err
            ? err instanceof QueryTooShortError
              ? <div className="message">{t('search query too short')}</div>
              : <div className="message">{t('search error', { message: err })}</div>
            : names.length === 0
              ? <div className="message">{t('no search result')}</div>
              : <PartsList
                names={names}
                handleItemClick={handleItemClick}
                handleItemMouseEnter={handleItemMouseEnter}
              />}
      </div>
      <div className="parts-hover-name" ref={hoverNameRef}>&nbsp;</div>
    </div>
  )
};

export default PartsSearch;
