import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

import normalizeCss from "normalize.css";

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
          <style dangerouslySetInnerHTML={{ __html: normalizeCss }} />
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
