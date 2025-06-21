// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2023, 2025  kurgm

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  base: './',
});
