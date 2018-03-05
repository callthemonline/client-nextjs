import Link from "next/link";
import styled from "styled-components";

import Menu from "../lib/components/Menu";
import page from "../lib/hocs/page";

const H1 = styled.h1`
  color: red !important;
  margin-left: 1em;
`;

export default page(["index", "common"])(({ t }) => (
  <div>
    <Menu />
    <H1>{t("greeting")}</H1>
  </div>
));
