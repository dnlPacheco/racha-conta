import { useTranslation } from 'react-i18next'
import { supportedLanguages, type LanguageCode } from '@/i18n'

export function useLanguage() {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language as LanguageCode
  const currentLanguageInfo = supportedLanguages.find(
    (lang) => lang.code === currentLanguage || currentLanguage.startsWith(lang.code.split('-')[0])
  ) || supportedLanguages[0]

  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code)
  }

  const getLocale = () => {
    switch (currentLanguageInfo.code) {
      case 'pt-BR':
        return 'pt-BR'
      case 'es':
        return 'es-ES'
      case 'en':
      default:
        return 'en-US'
    }
  }

  const getCurrency = () => {
    switch (currentLanguageInfo.code) {
      case 'pt-BR':
        return 'BRL'
      case 'es':
        return 'EUR'
      case 'en':
      default:
        return 'USD'
    }
  }

  return {
    currentLanguage: currentLanguageInfo.code,
    currentLanguageInfo,
    supportedLanguages,
    changeLanguage,
    getLocale,
    getCurrency,
  }
}
