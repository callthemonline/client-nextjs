import PropTypes from "prop-types";
import React from "react";
import { SipProvider } from "react-sip";

export default (ComposedComponent) => {
  class DynamicSipProvider extends React.Component {
    public static childContextTypes = {
      updateSipConfig: PropTypes.func,
    };
    public state = {
      sipConfig: {},
    };
    public render() {
      const { sipConfig } = this.state;
      return (
        <SipProvider {...sipConfig} debug={false}>
          <ComposedComponent {...this.props} />
        </SipProvider>
      );
    }
    public updateSipConfig(newConfig) {
      this.setState({ sipConfig: newConfig });
    }
    public getChildContext() {
      return {
        updateSipConfig: this.updateSipConfig.bind(this),
      };
    }
  }
  return DynamicSipProvider;
};
