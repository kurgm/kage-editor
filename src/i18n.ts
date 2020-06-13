import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import args from "./args";

import jaTranslation from './locales/ja.json';
import enTranslation from './locales/en.json';

const resources = {
  ja: {
    translation: jaTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

let lng = 'ja';
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
