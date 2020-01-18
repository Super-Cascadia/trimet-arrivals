import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import BookmarkRoute from "./BookmarkRoute";
import NearbyRoute from "./NearbyRoute";

export default function Routes() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/nearby">Nearby</Link>
        </li>
        <li>
          <Link to="/bookmarks">Bookmarks</Link>
        </li>
      </ul>
      <Switch>
        <Route exact={true} path="/">
          <NearbyRoute />
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
