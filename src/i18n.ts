import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import jaTranslation from './locales/ja.json';

import args from "./args";

const resources = {
  ja: {
    translation: jaTranslation,
  },
};

const host = args.get('host');
let lng = 'ja';
if (host) {
  switch (host.split('.')[0]) {
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
