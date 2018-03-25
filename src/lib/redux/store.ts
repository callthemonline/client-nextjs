import localForage from "localforage";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { autoRehydrate, persistStore } from "redux-persist";

import callLogReducer from "./callLog/reducer";
import persistenceReducer from "./persistence/reducer";

const isBrowser = (process as any).browser;
const composeEnhancers =
  isBrowser && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore() {
  const middlewares = [];

  const store = createStore(
    combineReducers({
      callLog: callLogReducer,
      persistence: persistenceReducer,
    }),
    undefined,
    composeEnhancers(autoRehydrate(), applyMiddleware(...middlewares)),
  );

  if (isBrowser) {
    persistStore(store, {
      storage: localForage,
      whitelist: ["callLog", "dialer"],
    });
  }
  return store;
}
