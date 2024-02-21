import i18next from 'i18next';
import { readFileSync } from 'fs'

const enTranslations = JSON.parse(readFileSync('./i18n/en.json', { encoding: 'utf8'}));
const esTranslations = JSON.parse(readFileSync('./i18n/es.json', { encoding: 'utf8'}));

i18next.init({
  lng: 'es', // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
        translation: enTranslations
    },
    es: {
        translation: esTranslations
    }
  }
});

// initialized and ready to go!
// i18next is already initialized, because the translation resources where passed via init function
console.log(i18next.t('greetings'));