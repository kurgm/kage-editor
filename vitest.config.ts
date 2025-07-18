// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2023  kurgm

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
