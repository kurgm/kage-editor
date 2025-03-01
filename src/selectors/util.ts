import { createSelector } from "@reduxjs/toolkit";

import { AppState } from "../reducers";

export const createAppSelector = createSelector.withTypes<AppState>();
