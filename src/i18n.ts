// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023, 2025  kurgm

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import args from "./args";

import jaTranslation from './locales/ja.json';
import enTranslation from './locales/en.json';
import koTranslation from './locales/ko.json';
import zhHansTranslation from './locales/zh-Hans.json';
import zhHantTranslation from './locales/zh-Hant.json';

const resources = {
  "ja": {
    translation: jaTranslation,
  },
  "en": {
    translation: enTranslation,
  },
  "ko": {
    translation: koTranslation,
  },
  "zh-Hans": {
    translation: zhHansTranslation,
  },
  "zh-Hant": {
    translation: zhHantTranslation,
  },
};

let lng: keyof typeof resources;
switch (args.host.split('.')[0]) {
  case 'en':
    lng = 'en';
    break;
  case 'ko':
    lng = 'ko';
    break;
  case 'zhs':
    lng = 'zh-Hans';
    break;
  case 'zht':
    lng = 'zh-Hant';
    break;
  default:
    lng = 'ja';
    break;
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng,
    fallbackLng: {
      'zh-Hans': ['zh-Hant', 'ja'],
      'zh-Hant': ['zh-Hans', 'ja'],
      'default': ['ja'],
    },

    returnObjects: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
