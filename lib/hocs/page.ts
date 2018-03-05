import { compose } from "recompose";

import withData from "./withData";
import withI18next from "./withI18next";

import "../pageEvents";

export default (i18nextNamespaces = ["common"]) =>
  compose(withData, withI18next(i18nextNamespaces));
