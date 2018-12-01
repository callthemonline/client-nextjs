import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { compose } from "recompose";
import { withContext } from "recompose";
import "../pageEvents";
import withData from "./withData";
import withDynamicSipProvider from "./withDynamicSipProvider";

// tslint:disable-next-line:no-var-requires
require("../../styles/index.css");

export default (i18nextNamespaces = ["common"]) =>
  compose(
    withNamespaces(i18nextNamespaces),
    withData,
    withContext(
      { conferencePhoneNumber: PropTypes.string },
      ({ conferencePhoneNumber }) => ({ conferencePhoneNumber }),
    ),
    withDynamicSipProvider,
  );
