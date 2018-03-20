import { cleanEnv, port, str, url } from "envalid";
import * as express from "express";
import * as next from "next";
import { join } from "path";
// import { parse } from "url";

import * as i18nextMiddleware from "i18next-express-middleware";
import * as Backend from "i18next-node-fs-backend";
import { i18nInstance } from "./i18n";

const env = cleanEnv(process.env, {
  GRAPHQL_URI: url(),
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 3000 }),
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
  .use(i18nextMiddleware.LanguageDetector)
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
          // req.i18n = i18nInstance;
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
