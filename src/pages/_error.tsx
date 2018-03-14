import Head from "next/head";
import Link from "next/link";

import PageHeader from "../lib/components/PageHeader";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

export default page(["_error", "common"])(({ t }) => (
  <PageLayout>
    <Head>
      <title>{t("page_title")}</title>
    </Head>
    <PageHeader color="red">{t("h1")}</PageHeader>
    <Link href="/">
      <a>{t("common:menu_home")}</a>
    </Link>
  </PageLayout>
));
