import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import appStore from "./store/store";
import BookmarksViewContainer from "./view/bookmarks/container/BookmarksViewContainer";
import Home from "./view/Home";
import NearbyStopsViewContainer from "./view/stops/containers/NearbyStopsViewContainer";

const store = appStore();

export default class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/nearby" component={NearbyStopsViewContainer} />
            <Route path="/bookmarks" component={BookmarksViewContainer} />
            <Route component={Home} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
