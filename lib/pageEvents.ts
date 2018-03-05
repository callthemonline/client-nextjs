import Router from "next/router";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
  if (window.gtag) {
    window.gtag("config", window.gaTrackingId, {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: window.document.title,
    });
  }
};
Router.onRouteChangeError = () => {
  NProgress.done();
};
Router.onAppUpdated = (nextRoute) => {
  window.location.href = nextRoute;
};

if (typeof window !== "undefined") {
  const oldOnError = window.onerror;
  window.onerror = (message, file, line) => {
    try {
      if (oldOnError) {
        oldOnError.apply(this, arguments);
      }
    } catch (e) {
      // nothing to do
    }
    if (window.gtag) {
      window.gtag("event", "onerror", {
        message,
        file,
        line,
      });
    }
  };
}
