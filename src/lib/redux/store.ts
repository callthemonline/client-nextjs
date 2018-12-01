import localForage from "localforage";
import { applyMiddleware, compose, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";

import callLogReducer from "./callLog/reducer";
import persistenceReducer from "./persistence/reducer";

const isBrowser = (process as any).browser;
const composeEnhancers =
  isBrowser && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const config = {
  key: "primary",
  storage: localForage,
  whitelist: ["callLog", "dialer"],
};

export default () => {
  const middlewares = [];

  const store = createStore(
    persistCombineReducers(config, {
      callLog: callLogReducer,
      persistence: persistenceReducer,
    }),
    undefined,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  if (isBrowser) {
    persistStore(store);
  }

  return store;
};
