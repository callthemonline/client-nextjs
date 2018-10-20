import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CallIcon from "@material-ui/icons/Call";
import CallEndIcon from "@material-ui/icons/CallEnd";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { get, trim } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "react-apollo";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import {
  CALL_STATUS_ACTIVE,
  CALL_STATUS_IDLE,
  CALL_STATUS_STARTING,
  SIP_STATUS_CONNECTED,
} from "react-sip";
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withPropsOnChange,
} from "recompose";
import sleep from "sleep-promise";
import styled from "styled-components";
import { GenerateSipConfig, UpdateDialer } from "../graphql/mutations";
import { DialerInfo } from "../graphql/queries";

const phoneUtil = PhoneNumberUtil.getInstance();

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
`;
const CallForm = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
`;
const ActionButtonWrapper = styled.div`
  width: 40px;
`;

const Dialer = ({
  phoneNumber,
  phoneNumberIsValid,
  phoneNumberIsEmpty,
  onPhoneNumberChange,
  onPhoneNumberFocus,
  onPhoneNumberKeyDown,
  onStartButtonClick,
  onStopButtonClick,
  callStatus,
  helperTextLabel,
  t,
}) => (
  <Wrapper>
    <CallForm>
      <TextField
        label={callStatus === CALL_STATUS_IDLE ? t("dialer.label") : " "}
        placeholder={t("dialer.sample")}
        error={!phoneNumberIsEmpty && !phoneNumberIsValid}
        helperText={helperTextLabel ? t(helperTextLabel) : " "}
        value={phoneNumber}
        disabled={callStatus !== CALL_STATUS_IDLE}
        InputProps={{
          onChange: onPhoneNumberChange,
          onFocus: onPhoneNumberFocus,
          onKeyDown: onPhoneNumberKeyDown,
        }}
      />
      <ActionButtonWrapper>
        {callStatus === CALL_STATUS_IDLE ? (
          <IconButton
            color={
              phoneNumberIsEmpty || !phoneNumberIsValid ? undefined : "primary"
            }
            disabled={phoneNumberIsEmpty || !phoneNumberIsValid}
            onClick={onStartButtonClick}
          >
            <CallIcon />
          </IconButton>
        ) : null}
        {callStatus === CALL_STATUS_ACTIVE ? (
          <IconButton color="primary" onClick={onStopButtonClick}>
            <CallEndIcon />
          </IconButton>
        ) : null}
        {callStatus === CALL_STATUS_STARTING ? (
          <IconButton color="primary" onClick={onStopButtonClick}>
            <PhoneInTalkIcon />
          </IconButton>
        ) : null}
      </ActionButtonWrapper>
    </CallForm>
  </Wrapper>
);

export default compose(
  translate("common"),
  withPropsOnChange([], () => ({
    requireLogin: () => {
      window.location.href = "/login";
    },
  })),
  graphql(GenerateSipConfig, { name: "generateSipConfig" }),
  graphql(UpdateDialer, { name: "updateDialer" }),
  graphql<
    {},
    { dialer: { phoneNumber?: string } },
    {},
    { phoneNumber: string }
  >(DialerInfo, {
    props: ({ data: { dialer = {} } }) => ({
      phoneNumber: dialer.phoneNumber || "",
    }),
  }),
  getContext({
    startCall: PropTypes.func,
    stopCall: PropTypes.func,
    sip: PropTypes.object,
    call: PropTypes.object,
    updateSipConfig: PropTypes.func,
    conferencePhoneNumber: PropTypes.string,
  }),
  withPropsOnChange(["sip", "call"], ({ sip, call }) => ({
    sipStatus: sip.status,
    callStatus: call.status,
  })),
  connect(
    () => ({}),
    (dispatch) => ({
      addToCallLog: (entry) =>
        dispatch({
          type: "callLog/ADD",
          entry,
        }),
    }),
  ),
  withPropsOnChange(
    ["phoneNumber"],
    ({ phoneNumber, conferencePhoneNumber }) => {
      const phoneNumberIsEmpty = trim(phoneNumber) === "";
      let phoneNumberIsValid = false;
      if (phoneNumber.replace(/\s/g, "") === conferencePhoneNumber) {
        phoneNumberIsValid = true;
      } else if (!phoneNumberIsEmpty) {
        try {
          const phoneNumberProto = phoneUtil.parse(phoneNumber, "UK");
          phoneNumberIsValid = phoneUtil.isValidNumber(phoneNumberProto);
        } catch (e) {
          // no need to do anything if phone number did not pass validation
        }
      }
      return {
        phoneNumberIsValid,
        phoneNumberIsEmpty,
      };
    },
  ),
  withPropsOnChange(["callStatus"], ({ callStatus }) => {
    let helperTextLabel = null;
    if (callStatus === CALL_STATUS_STARTING) {
      helperTextLabel = "dialer.dialing";
    }
    if (callStatus === CALL_STATUS_ACTIVE) {
      helperTextLabel = "dialer.onAir";
    }
    return {
      helperTextLabel,
      callStatus: callStatus || CALL_STATUS_IDLE,
    };
  }),
  withHandlers({
    getSipStatus: ({ sipStatus }) => () => sipStatus,
  }),
  withHandlers({
    startCallIfNeeded: ({
      getSipStatus,
      callStatus,
      phoneNumberIsValid,
      phoneNumber,
      updateDialer,
      startCall,
      addToCallLog,
      generateSipConfig,
      requireLogin,
      updateSipConfig,
      conferencePhoneNumber,
    }) => async () => {
      if (callStatus === CALL_STATUS_IDLE && phoneNumberIsValid) {
        let phoneNumberForSip;
        let phoneNumberForLog;
        if (phoneNumber.replace(/\s/g, "") === conferencePhoneNumber) {
          phoneNumberForSip = conferencePhoneNumber;
          phoneNumberForLog = conferencePhoneNumber;
        } else {
          phoneNumberForSip = phoneUtil.format(
            phoneUtil.parse(phoneNumber, "UK"),
            PhoneNumberFormat.E164,
          );
          phoneNumberForLog = phoneUtil.format(
            phoneUtil.parse(phoneNumber, "UK"),
            PhoneNumberFormat.INTERNATIONAL,
          );
        }
        await updateDialer({ variables: { phoneNumber: phoneNumberForLog } });
        try {
          const response = await generateSipConfig({
            variables: {
              phoneNumber: phoneNumberForSip,
            },
          });
          const config = get(response, ["data", "generateSipConfig", "config"]);
          updateSipConfig(config);
          let i = 20;
          while (i > 0 && getSipStatus() !== SIP_STATUS_CONNECTED) {
            await sleep(100);
            i -= 1;
          }
          startCall(phoneNumberForSip);
          addToCallLog({
            phoneNumber: phoneNumberForLog,
            startTimestamp: +new Date(),
          });
        } catch (e) {
          requireLogin();
        }
      }
    },
  }),
  withHandlers({
    onPhoneNumberChange: ({ updateDialer }) => (e) => {
      updateDialer({ variables: { phoneNumber: e.target.value } });
    },
    onPhoneNumberFocus: ({ callStatus }) => (e) => {
      const { target } = e;
      setTimeout(() => {
        if (callStatus === CALL_STATUS_IDLE && target) {
          target.select();
        }
      }, 50);
    },
    onPhoneNumberKeyDown: ({ startCallIfNeeded }) => (e) => {
      if (e.which === 13) {
        // enter
        startCallIfNeeded();
      }
    },
    onStartButtonClick: ({ startCallIfNeeded }) => () => {
      startCallIfNeeded();
    },
    onStopButtonClick: ({ stopCall, callStatus }) => () => {
      if (callStatus === CALL_STATUS_ACTIVE) {
        stopCall();
      }
    },
  }),
  pure,
)(Dialer);
