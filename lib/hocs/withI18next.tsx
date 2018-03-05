import { translate } from "react-i18next";
import { getInitialProps, I18n } from "../i18n";

const isBrowser = typeof window !== "undefined";

export default (namespaces = ["common"]) => (ComposedComponent) => {
  const TranslatedComponent = translate(namespaces, {
    i18n: I18n,
    wait: isBrowser,
  })(ComposedComponent);

  (TranslatedComponent as any).getInitialProps = async (ctx) => {
    const composedInitialProps = ComposedComponent.getInitialProps
      ? await ComposedComponent.getInitialProps(ctx)
      : {};

    const i18nInitialProps =
      ctx.req && !isBrowser ? getInitialProps(ctx.req, namespaces) : {};

    return {
      ...composedInitialProps,
      ...i18nInitialProps,
    };
  };

  return TranslatedComponent;
};
