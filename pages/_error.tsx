import Link from "next/link";
import React from "react";
import styled from "styled-components";

import PageHeader from "../lib/components/PageHeader";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";
import withI18next from "../lib/hocs/withI18next";

export default page()(({ t }) => (
  <PageLayout>
    <PageHeader color="red">{t("page_not_found")}</PageHeader>
    <Link href="/">
      <a>{t("menu_home")}</a>
    </Link>
  </PageLayout>
));
