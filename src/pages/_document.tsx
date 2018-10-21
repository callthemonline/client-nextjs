import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";
import flush from "styled-jsx/server";

export default class extends Document<{ locale; styleTags; pageContext }> {
  public static getInitialProps({ renderPage, req }: { renderPage; req? }) {
    let pageContext;
    const sheet = new ServerStyleSheet();
    const page = renderPage((Component) => {
      const WrappedComponent = (props) => {
        pageContext = props.pageContext;
        return sheet.collectStyles(<Component {...props} />);
      };

      return WrappedComponent;
    });

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
      styleTags: sheet.getStyleElement(),
    };
  }

  public render() {
    const { pageContext, locale } = this.props;

    return (
      <html lang={locale}>
        <Head>
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
