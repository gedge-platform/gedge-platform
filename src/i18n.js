import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationGr from './locales/gr/translation.json';
import translationIT from './locales/it/translation.json';
import translationRS from './locales/rs/translation.json';
import translationSP from './locales/sp/translation.json';
import translationENG from './locales/en/translation.json';
import translationKO from './locales/ko/translation.json';

//translations
const resources = {
  ko: {
    translation: translationKO
  },
  gr: {
    translation: translationGr
  },
  it: {
    translation: translationIT
  },
   rs: {
    translation: translationRS
  },
   sp: {
    translation: translationSP
  },
   eng: {
    translation: translationENG
  }
};

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ko",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;