// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { test, expect } from 'vitest';

import App from './App';
import store from './store';
import './i18n';

const customRender = (
  ui: React.ReactNode,
  options?: Omit<RenderOptions, "queries" | "container">,
) => {
  const rootDiv = document.body.appendChild(document.createElement('div'));
  rootDiv.id = 'root';

  ReactModal.setAppElement(rootDiv);

  return render(
    <Provider store={store}>
      {ui}
    </Provider>,
    {
      ...options,
      container: rootDiv,
    },
  );
}

test('clicking option button opens a dialog', async () => {
  customRender(<App />);

  expect(screen.queryByRole('dialog')).toBeNull();

  await userEvent.click(screen.getByText('設定…'));

  const modalElement = screen.getByRole('dialog');
  expect(modalElement).toBeVisible();
});
