import { compose } from "recompose";

import "../pageEvents";
import withData from "./withData";
import withI18next from "./withI18next";

// tslint:disable-next-line:no-var-requires
require("../../styles/index.css");

export default (i18nextNamespaces = ["common"]) =>
  compose(withData, withI18next(i18nextNamespaces));
