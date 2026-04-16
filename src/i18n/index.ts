import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import de from './locales/de.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import pl from './locales/pl.json'
import ru from './locales/ru.json'
import cs from './locales/cs.json'
import sk from './locales/sk.json'
import sl from './locales/sl.json'
import hr from './locales/hr.json'
import hu from './locales/hu.json'
import sv from './locales/sv.json'
import no from './locales/no.json'
import fi from './locales/fi.json'
import el from './locales/el.json'
import tr from './locales/tr.json'
import ar from './locales/ar.json'
import nl from './locales/nl.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
      pt: { translation: pt },
      pl: { translation: pl },
      ru: { translation: ru },
      cs: { translation: cs },
      sk: { translation: sk },
      sl: { translation: sl },
      hr: { translation: hr },
      hu: { translation: hu },
      sv: { translation: sv },
      no: { translation: no },
      fi: { translation: fi },
      el: { translation: el },
      tr: { translation: tr },
      ar: { translation: ar },
      nl: { translation: nl },
      ja: { translation: ja },
      zh: { translation: zh },
    },
    fallbackLng: 'de',
    supportedLngs: ['de', 'en', 'fr', 'it', 'es', 'pt', 'pl', 'ru', 'cs', 'sk', 'sl', 'hr', 'hu', 'sv', 'no', 'fi', 'el', 'tr', 'ar', 'nl', 'ja', 'zh'],
    interpolation: { escapeValue: false },
    detection: {
      // On 'auto': detect from browser navigator, then localStorage
      // On explicit choice: localStorage is written and takes precedence
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'visemte-language',
    },
  })

export default i18n
