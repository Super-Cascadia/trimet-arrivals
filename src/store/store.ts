import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { rootSaga } from "./sagas";

export default function appStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, applyMiddleware(thunk, sagaMiddleware));

  sagaMiddleware.run(rootSaga);

  return store;
}
