import CssBaseline from "material-ui/CssBaseline";
import { MuiThemeProvider } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import getPageContext from "../getPageContext";

function withMuiThemeProvider(Component) {
  class WithMuiThemeProvider extends React.Component<{ pageContext: {} }> {
    public pageContext = null;

    constructor(props, context) {
      super(props, context);

      this.pageContext = this.props.pageContext || getPageContext();
    }

    public componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    public render() {
      // MuiThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...this.props} />
        </MuiThemeProvider>
      );
    }
  }

  (WithMuiThemeProvider as any).propTypes = {
    pageContext: PropTypes.object,
  };

  (WithMuiThemeProvider as any).getInitialProps = (ctx) => {
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx);
    }

    return {};
  };

  return WithMuiThemeProvider;
}

export default withMuiThemeProvider;
