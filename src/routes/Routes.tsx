import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BookmarksViewContainer from "../view/bookmarks/container/BookmarksViewContainer";
import MainNavigationContainer from "../view/mainNav/containers/MainNavigationContainer";
import NearbyViewContainer from "../view/nearby/containers/NearbyViewContainer";

export default function Routes() {
  return (
    <Router>
      <MainNavigationContainer />
      <main className="main-view">
        <Switch>
          <Route exact={true} path="/">
            Home
          </Route>
          <Route path="/nearby">
            <NearbyViewContainer />
          </Route>
          <Route path="/bookmarks">
            <BookmarksViewContainer />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
