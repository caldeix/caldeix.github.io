import { createI18n } from 'vue-i18n'
import es from './locales/es.json'

// Todos los textos de la web salen de src/locales/<idioma>.json.
// Para añadir un idioma: crear el JSON con las mismas claves y añadirlo a messages.
export type MessageSchema = typeof es

export const i18n = createI18n<[MessageSchema], 'es'>({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es },
})
