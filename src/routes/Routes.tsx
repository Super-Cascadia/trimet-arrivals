import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ViewContainer from "../view/ViewContainer";
import BookmarkRoute from "./BookmarkRoute";
import NearbyRoute from "./NearbyRoute";

export default function Routes() {
  return (
    <Router>
      <ViewContainer />
      <main className="main-view">
        <Switch>
          <Route exact={true} path="/">
            Home
          </Route>
          <Route path="/nearby">
            <NearbyRoute />
          </Route>
          <Route path="/bookmarks">
            <BookmarkRoute />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
