import { InitOptions } from "i18next";
import * as ICU from "i18next-icu";
import en from "i18next-icu/locale-data/en";
import ru from "i18next-icu/locale-data/ru";
import NextI18Next from "next-i18next";

const options: InitOptions = {
  defaultLanguage: "en",
  otherLanguages: ["ru"],
  localePath: "./locales",
  keySeparator: "###",
};

const nextI18Next = new NextI18Next(options);

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
nextI18Next.i18n.use(icu);

export default nextI18Next;
