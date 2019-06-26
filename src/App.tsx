import React, { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import RouteLoadIndicator from "./component/loadIndicator/RouteLoadIndicator";
import appStore from "./store/store";

const store = appStore();

const NearbyStopsViewContainer = lazy(() =>
  import(
    /* webpackChunkName: "NearbyTransitViewContainer" */ "./view/stops/containers/NearbyTransitViewContainer"
  )
);
const BookmarksViewContainer = lazy(() =>
  import(
    /* webpackChunkName: "BookmarksViewContainer" */ "./view/bookmarks/container/BookmarksViewContainer"
  )
);
const Home = lazy(() => import(/* webpackChunkName: "Home" */ "./view/Home"));

export default class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router basename={process.env.PUBLIC_URL}>
          <Suspense fallback={RouteLoadIndicator()}>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route path="/nearby" component={NearbyStopsViewContainer} />
              <Route path="/bookmarks" component={BookmarksViewContainer} />
              <Route component={Home} />
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}
