import * as envalid from "envalid";
import * as express from "express";
import * as i18nextMiddleware from "i18next-express-middleware";
import * as Backend from "i18next-node-fs-backend";
import * as next from "next";
import { join } from "path";
// import { parse } from "url";
import { i18nInstance } from "./i18n";

const env = envalid.cleanEnv(process.env, {
  GRAPHQL_URI: envalid.url(),
  NODE_ENV: envalid.str({ default: "development" }),
  PORT: envalid.port({ default: 3000 }),
  CONFERENCE_PHONE_NUMBER: envalid.str({ default: "3500" }),
  HOST_RU: envalid.host({
    desc: "host for which the interface is shown in Russian",
    default: "none",
  }),
});

export const languageDetector = new i18nextMiddleware.LanguageDetector(null, {
  order: ["querystring", "languageByDomain"],
  lookupQuerystring: "lang",
});

languageDetector.addDetector({
  name: "languageByDomain",
  lookup: (opts) => {
    const hostWithoutPort = (opts.headers.host || "").replace(/\:\d+$/, "");
    return hostWithoutPort === env.HOST_RU ? "ru" : "en";
  },
});

const app = next({
  dir: __dirname,
  conf: env.NODE_ENV === "production" ? { distDir: "../.next" } : undefined,
  dev: env.NODE_ENV !== "production",
});
const handle = app.getRequestHandler();

// init i18next with server-side settings
// using i18next-express-middleware
i18nInstance
  .use(Backend)
  .use(languageDetector)
  .init(
    {
      fallbackLng: "en",
      preload: ["en", "ru"], // preload all languages
      ns: ["_error", "common", "index", "data-demo"], // need to preload all the namespaces
      backend: {
        loadPath: join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
        addPath: join(__dirname, "../locales/{{lng}}/{{ns}}.missing.json"),
      },
    },
    () => {
      app.prepare().then(() => {
        const server = express();

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance));

        // serve locales for client
        server.use("/locales", express.static(join(__dirname, "../locales")));

        // missing keys
        server.post(
          "/locales/add/:lng/:ns",
          i18nextMiddleware.missingKeyHandler(i18nInstance),
        );

        // use next.js
        server.get("*", (req, res) => {
          // const parsedUrl = parse(req.url, true);
          (req as any).graphqlUri = env.GRAPHQL_URI;
          (req as any).conferencePhoneNumber = env.CONFERENCE_PHONE_NUMBER;
          handle(req, res);
        });

        server.listen(env.PORT, (err) => {
          if (err) {
            throw err;
          }
          console.log(`> Ready on port ${env.PORT}`);
        });
      });
    },
  );
