import Head from "next/head";

import Menu from "../lib/components/Menu";
import PageHeader from "../lib/components/PageHeader";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

export default page(["index", "common"])(({ t }) => (
  <PageLayout>
    <Head>
      <title>{t("page_title")}</title>
    </Head>
    <Menu />
    <PageHeader>{t("greeting")}</PageHeader>
  </PageLayout>
));
