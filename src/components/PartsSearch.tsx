// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2025  kurgm

import React, { useRef, useCallback, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../hooks';
import { editorActions } from '../actions/editor';
import { search } from '../callapi';
import args from '../args';

import PartsList from './PartsList';

import './PartsSearch.css';

const searchSuggestions = [
  'エディタ部品1',
  'エディタ部品2',
  'エディタ部品3',
  'エディタ部品4',
];

const initialQuery = args.name || '';

class QueryTooShortError extends Error { }

interface SearchState {
  query: string;
  result: string[] | null;
  err: unknown;
}

const initialSearchState: SearchState = {
  query: '',
  result: [],
  err: null,
};

const PartsSearch = () => {
  const queryInputRef = useRef<HTMLInputElement>(null);
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);

  const startSearch = (query: string) => {
    setSearchState({
      query,
      result: null,
      err: null,
    });
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
      .then((names): SearchState => ({
        query,
        result: names,
        err: null,
      }))
      .catch((reason): SearchState => ({
        query,
        result: null,
        err: reason,
      }))
      .then((newSearchState) => {
        setSearchState((currentSearchState) => (
          (currentSearchState.query === query)
            ? newSearchState
            : currentSearchState // query has changed, discard result
        ));
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
      setSearchState({
        query,
        result: [],
        err: null,
      });
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
  const dispatch = useAppDispatch();
  const handleItemClick = useCallback((partName: string, evt: React.MouseEvent) => {
    if (evt.shiftKey) {
      if (!queryInputRef.current) {
        return;
      }
      queryInputRef.current.value = partName;
      startSearch(partName);
    } else {
      dispatch(editorActions.insertPart(partName));
    }
  }, [dispatch]);

  const { t } = useTranslation();
  return (
    <div className="parts-search-area">
      <form className="parts-search-box" onSubmit={handleFormSubmit}>
        <input defaultValue={initialQuery} list="searchList" ref={queryInputRef} />
        <button>
          {t('search')}
        </button>
        <datalist id="searchList">
          {searchSuggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      </form>
      <div className="parts-list-area">
        {searchState.err
          ? searchState.err instanceof QueryTooShortError
            ? <div className="message">{t('search query too short')}</div>
            : <div className="message">{t('search error', { message: searchState.err })}</div>
          : !searchState.result
            ? <div className="message">{t('searching')}</div>
            : searchState.result.length === 0
              ? <div className="message">{t('no search result')}</div>
              : <PartsList
                names={searchState.result}
                handleItemClick={handleItemClick}
                handleItemMouseEnter={handleItemMouseEnter}
              />}
      </div>
      <div className="parts-hover-name" ref={hoverNameRef}>&nbsp;</div>
    </div>
  )
};

export default PartsSearch;
