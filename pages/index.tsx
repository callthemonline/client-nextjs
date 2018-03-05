import Link from "next/link";

import Menu from "../lib/components/Menu";
import PageHeader from "../lib/components/PageHeader";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

export default page(["index", "common"])(({ t }) => (
  <PageLayout>
    <Menu />
    <PageHeader>{t("greeting")}</PageHeader>
  </PageLayout>
));
