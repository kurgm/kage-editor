// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducers';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;

export default store;
