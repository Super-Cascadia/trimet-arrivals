import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { thunk } from "redux-thunk";
import reducers from "./reducers";
import { rootSaga } from "./sagas";

let storeInstance: any = null;

export default function appStore() {
  const composeEnhancers =
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);
  
  storeInstance = store;

  return store;
}

export function getStore() {
  return storeInstance;
}
