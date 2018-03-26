import * as i18n from "i18next";
import { InitOptions } from "i18next";
import * as XHR from "i18next-xhr-backend";

const isBrowser = typeof window !== "undefined";

const options: InitOptions = {
  fallbackLng: "en",
  load: "languageOnly", // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ["common"],
  defaultNS: "common",

  debug: false, // process.env.NODE_ENV !== "production",
  saveMissing: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
    format: (value, format /*, lng */) => {
      if (format === "uppercase") {
        return value.toUpperCase();
      }
      if (format === "date") {
        return new Date(parseInt(value, 10) * 1000).toString();
      }
      return value;
    },
  },
};

const i18nInstance: i18n.i18n = i18n;
// for browser use xhr backend to load translations and browser lng detector
if (isBrowser) {
  i18nInstance.use(XHR);
}

// initialize if not already initialized
if (!i18nInstance.isInitialized) {
  i18nInstance.init(options);
}

const getInitialProps = (req, namespaces) => {
  if (!namespaces) {
    namespaces = i18nInstance.options.defaultNS;
  }
  if (typeof namespaces === "string") {
    namespaces = [namespaces];
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

const I18n = i18n["default"];

export { getInitialProps, I18n, i18nInstance };
