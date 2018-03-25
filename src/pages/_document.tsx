import { createHash } from "crypto";
import { readFileSync } from "fs";
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { ServerStyleSheet } from "styled-components";
import flush from "styled-jsx/server";
import getPageContext from "../lib/getPageContext";

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
    const pageContext = getPageContext();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(
        <JssProvider
          registry={pageContext.sheetsRegistry}
          generateClassName={pageContext.generateClassName}
        >
          <App pageContext={pageContext} {...props} />
        </JssProvider>,
      ),
    );
    const styleTags = sheet.getStyleElement();
    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString(),
            }}
          />
          {flush() || null}
        </React.Fragment>
      ),
      styleTags,
    };
  }

  public render() {
    const { pageContext } = this.props;

    return (
      <html>
        <Head>
          <title>Test Page</title>
          <link rel="stylesheet" href={`/_next/static/style.css${version}`} />
          {this.props.styleTags}
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              "user-scalable=0, initial-scale=1, " +
              "minimum-scale=1, width=device-width, height=device-height"
            }
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="callthem.online" />
          <meta name="application-name" content="callthem.online" />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />{" "}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
