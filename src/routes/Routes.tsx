import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainNavigationRoute from "../component/nav/MainNavigationRoute";
import { NEARBY_STOPS_VIEW } from "../store/reducers/viewReducer";
import BookmarkRoute from "./BookmarkRoute";
import NearbyRoute from "./NearbyRoute";

export default function Routes() {
  return (
    <Router>
      <MainNavigationRoute
        activeView={NEARBY_STOPS_VIEW}
        numberOfBookmarks={1}
        timeOfLastLoad={"123"}
      />
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
    </Router>
  );
}
