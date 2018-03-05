import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

import normalizeCss from "normalize.css";
import baseCss from "../styles/base.css";
import nprogressCss from "../styles/nprogress.css";

export default class MyDocument extends Document {
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
          <style
            dangerouslySetInnerHTML={{
              __html: normalizeCss + baseCss + nprogressCss,
            }}
          />
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
