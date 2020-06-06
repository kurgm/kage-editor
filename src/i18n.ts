import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import jaTranslation from './locales/ja.json';

const resources = {
  ja: {
    translation: jaTranslation,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ja', // TODO: detect from parameter

    returnObjects: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
