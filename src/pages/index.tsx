import MainAreaWithDialer from "../lib/components/MainAreaWithDialer";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

export default page(["index", "common"])(({ t }) => (
  <PageLayout title={t("page_title")}>
    <MainAreaWithDialer />
  </PageLayout>
));
