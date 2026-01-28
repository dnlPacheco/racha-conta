import i18n from '@/i18n'

function getLocaleAndCurrency(): { locale: string; currency: string } {
  const lang = i18n.language

  if (lang === 'pt-BR' || lang.startsWith('pt')) {
    return { locale: 'pt-BR', currency: 'BRL' }
  }
  if (lang === 'es' || lang.startsWith('es')) {
    return { locale: 'es-ES', currency: 'EUR' }
  }
  return { locale: 'en-US', currency: 'USD' }
}

export function formatCurrency(value: number): string {
  const { locale, currency } = getLocaleAndCurrency()
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  const { locale } = getLocaleAndCurrency()
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
