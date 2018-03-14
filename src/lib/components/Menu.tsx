import { translate } from "react-i18next";
import { TranslationFunction } from "react-i18next";

import ActiveLink from "./ActiveLink";

export default translate(["common"])(({ t }: { t: TranslationFunction }) => (
  <ul>
    <li>
      <ActiveLink href="/">{t("menu_home")}</ActiveLink>
    </li>
    <li>
      <ActiveLink href="/data-demo">{t("menu_data-demo")}</ActiveLink>
    </li>
    <li>
      <ActiveLink href="/404">{t("menu_404")}</ActiveLink>
    </li>
  </ul>
));
