import { cleanEnv, port, str, url } from "envalid";
import { createServer } from "http";
import * as next from "next";
import { parse } from "url";

const env = cleanEnv(process.env, {
  GRAPHQL_URI: url(),
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 3000 }),
});

const app = next({ dev: env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    (req as any).graphqlUri = env.GRAPHQL_URI;
    handle(req, res, parsedUrl);
  }).listen(env.PORT, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on port ${env.PORT}`);
  });
});
