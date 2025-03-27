// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import az from './locales/az.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { az: { translation: az }, ru: { translation: ru }, en: { translation: en } },
    lng: localStorage.getItem('app_language') || 'ru', 
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

export default i18n;
