import { InitOptions } from "i18next";
import * as ICU from "i18next-icu";
import en from "i18next-icu/locale-data/en";
import ru from "i18next-icu/locale-data/ru";
import * as XHR from "i18next-xhr-backend";
import * as i18next from "i18next/index"; // force commonjs

const isBrowser = typeof window !== "undefined";

export const supportedLanguages = ["ru", "en"];
const options: InitOptions = {
  fallbackLng: supportedLanguages[0],
  load: "languageOnly",

  ns: ["common"],
  defaultNS: "common",
  whitelist: supportedLanguages,

  debug: false, // process.env.NODE_ENV !== "production",
  saveMissing: process.env.NODE_ENV !== "production",
  keySeparator: "###",

  interpolation: {
    escapeValue: false,
  },
};

const i18n: i18next.i18n = i18next;

const icu = new ICU({
  formats: {
    number: {
      PRICE: {
        minimumFractionDigits: 2,
        useGrouping: false,
      },
    },
  },
});
icu.addLocaleData(en);
icu.addLocaleData(ru);
i18n.use(icu);

// for browser use xhr backend to load translations and browser lng detector
if (isBrowser) {
  i18n.use(XHR);
}

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(options);
}

export const getInitialProps = (req, namespaces) => {
  if (!namespaces) {
    namespaces = [i18n.options.defaultNS];
  }

  req.i18n.toJSON = () => null; // do not serialize i18next instance and send to client

  const initialI18nStore = {};
  req.i18n.languages.forEach((l) => {
    initialI18nStore[l] = {};
    namespaces.forEach((ns) => {
      initialI18nStore[l][ns] =
        (req.i18n.services.resourceStore.data[l] || {})[ns] || {};
    });
  });

  return {
    i18n: req.i18n, // use the instance on req - fixed language on request (avoid issues in race conditions with lngs of different users)
    initialI18nStore,
    initialLanguage: req.i18n.language,
  };
};

export default i18n;
