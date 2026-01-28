import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import ptBRTranslation from './locales/pt-BR/translation.json'
import esTranslation from './locales/es/translation.json'

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'pt-BR', name: 'Português', flag: 'PT' },
  { code: 'es', name: 'Español', flag: 'ES' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      'pt-BR': { translation: ptBRTranslation },
      es: { translation: esTranslation },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
