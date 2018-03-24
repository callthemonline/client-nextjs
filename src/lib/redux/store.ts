import localForage from "localforage";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { autoRehydrate, persistStore } from "redux-persist";

import callLogReducer from "./callLog/reducer";

const composeEnhancers =
  typeof window !== "undefined"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore() {
  const middlewares = [];

  return createStore(
    combineReducers({
      callLog: callLogReducer,
    }),
    undefined,
    composeEnhancers(autoRehydrate(), applyMiddleware(...middlewares)),
  );
}
