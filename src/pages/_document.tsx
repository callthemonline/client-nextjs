import { createHash } from "crypto";
import { readFileSync } from "fs";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

// prevent caching in production
// https://github.com/zeit/next-plugins/issues/11#issuecomment-370537941
let version = "";
if (process.env.NODE_ENV === "production") {
  const hash = createHash("sha256");
  hash.update(readFileSync(`${process.cwd()}/.next/static/style.css`));
  version = `?v=${hash.digest("hex").substr(0, 8)}`;
}

export default class extends Document {
  public static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  public render() {
    return (
      <html>
        <Head>
          <title>Test Page</title>
          <link rel="stylesheet" href={`/_next/static/style.css${version}`} />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
