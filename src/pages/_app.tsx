import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import withRedux from "next-redux-wrapper";
import App, { Container } from "next/app";
import React from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { Provider } from "react-redux";
import getPageContext from "../lib/getPageContext";
import createStore from "../lib/redux/store";

class MyApp extends App<{ store }> {
  public static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  private pageContext;

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  public componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <Container>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
              <Component pageContext={this.pageContext} {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </Container>
      </Provider>
    );
  }
}

export default withRedux(createStore)(MyApp);
