// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2022  kurgm

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';

import store from './store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
