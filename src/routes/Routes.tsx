import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams
} from "react-router-dom";
import BookmarksViewContainer from "../view/bookmarks/container/BookmarksViewContainer";
import Home from "../view/home/Home";
import LinesViewContainer from "../view/lines/container/LinesViewContainer";
import MainNavigationContainer from "../view/mainNav/containers/MainNavigationContainer";
import NearbyViewContainer from "../view/nearby/containers/NearbyViewContainer";
import StopLocationViewContainer from "../view/stop/container/StopLocationViewContainer";

function StopLocationViewRouter() {
  const { id } = useParams();

  return <StopLocationViewContainer locationId={id} />;
}

export default function Routes() {
  return (
    <Router>
      <MainNavigationContainer />
      <main className="main-view">
        <Switch>
          <Route exact={true} path="/">
            <Home />
          </Route>
          <Route path="/nearby">
            <NearbyViewContainer />
          </Route>
          <Route path="/stop/:id">
            <StopLocationViewRouter />
          </Route>
          <Route path="/lines">
            <LinesViewContainer />
          </Route>
          <Route path="/bookmarks">
            <BookmarksViewContainer />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
