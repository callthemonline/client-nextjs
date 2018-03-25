import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import { getContext } from "recompose";
import styled from "styled-components";
import AppBar from "./AppBar";

const Wrapper = getContext({
  call: PropTypes.object,
})(styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`);

class PageLayout extends React.Component<{ children; title }> {
  public render() {
    const { children, title } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>{title}</title>
        </Head>
        <Wrapper>
          <AppBar />
          {children}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default PageLayout;
