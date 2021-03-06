import { readFileSync } from "fs";
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { ServerStyleSheet } from "styled-components";
import flush from "styled-jsx/server";
import getPageContext from "../lib/getPageContext";

let style = null;
if (process.env.NODE_ENV === "production") {
  // ${"css"} prevents editors from incorrectly highlighting code after css`
  style = readFileSync(`${process.cwd()}/.next/static/style.${"css"}`, "utf8");
}

export default class extends Document {
  public static getInitialProps({ renderPage, req }) {
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
      locale: req.locale,
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
    const { pageContext, locale } = this.props;

    return (
      <html lang={locale}>
        <Head>
          <title>Test Page</title>
          {typeof style === "string" ? (
            <style>{style}</style>
          ) : (
            <link rel="stylesheet" href="/_next/static/style.css" />
          )}
          {this.props.styleTags}
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              "user-scalable=0, initial-scale=1, " +
              "minimum-scale=1, width=device-width, height=device-height"
            }
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="callthem.online" />
          <meta name="application-name" content="callthem.online" />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
