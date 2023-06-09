import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locale/en';
import { nl } from './locale/nl';

const resources = {
  en: {
    en
  },
  nl: {
    nl
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
