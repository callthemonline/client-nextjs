import Head from "next/head";
import Link from "next/link";

import MainAreaWith404 from "../lib/components/MainAreaWith404";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

export default page(["_error", "common"])(({ t }) => (
  <PageLayout title={t("page_title")}>
    <Link href="/">
      <MainAreaWith404 />
    </Link>
  </PageLayout>
));
