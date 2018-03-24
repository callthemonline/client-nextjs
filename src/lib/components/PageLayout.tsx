import Head from "next/head";
import React from "react";
import styled from "styled-components";
import AppBar from "./AppBar";
import DynamicSipProvider from "./DynamicSipProvider";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const PageLayout = ({ children, title }) => (
  <DynamicSipProvider>
    <Head>
      <title>{title}</title>
    </Head>
    <Wrapper>
      <AppBar />
      {children}
    </Wrapper>
  </DynamicSipProvider>
);

export default PageLayout;
