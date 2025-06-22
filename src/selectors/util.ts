// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2025  kurgm

import { createSelector } from "@reduxjs/toolkit";

import { AppState } from "../reducers";

export const createAppSelector = createSelector.withTypes<AppState>();
