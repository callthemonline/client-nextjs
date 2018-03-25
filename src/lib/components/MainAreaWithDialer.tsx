import React from "react";
import NoSSR from "react-no-ssr";
import { connect } from "react-redux";
import { branch, compose, renderComponent } from "recompose";
import styled from "styled-components";
import CallLog from "./CallLog";
import Dialer from "./Dialer";
import Loading from "./Loading";
import MainArea from "./MainArea";

const DialWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p["data-calllogisempty"] ? 1 : 0)};
  position: relative;
  transition: all 0.5s ease-in-out;
  min-height: 120px;
`;
const CallLogWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p["data-calllogisempty"] ? 0 : 1)};
  height: ${(p) => (p["data-calllogisempty"] ? 0 : "auto")};
  position: relative;
  transition: all 0.5s ease-in-out;
  overflow: scroll;
`;

const MainAreaWithDialer = ({ callLogIsEmpty = true }) => (
  <MainArea>
    <NoSSR onSSR={<Loading />}>
      <DialWrapper data-calllogisempty={callLogIsEmpty}>
        <Dialer />
      </DialWrapper>
      <CallLogWrapper data-calllogisempty={callLogIsEmpty}>
        <CallLog />
      </CallLogWrapper>
    </NoSSR>
  </MainArea>
);

export default compose(
  connect(
    (state) => ({
      callLogIsEmpty: !state.callLog.entries.length,
      rehydrationComplete: !state.persistence.rehydrationComplete,
    }),
    null,
    null,
    { pure: false },
  ),
  branch(
    ({ rehydrationComplete }) => rehydrationComplete,
    renderComponent(Loading),
  ),
)(MainAreaWithDialer);
