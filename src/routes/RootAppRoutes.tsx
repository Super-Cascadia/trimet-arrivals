import { size } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useOutletContext,
  useParams,
  Navigate
} from "react-router-dom";
import { RootState } from "../store/reducers";
import BookmarksViewV2 from "../view/bookmarks/component/BookmarksViewV2";
import Home from "../view/home/Home";
import SearchHome from "../view/home/SearchHome";
import LineDetailComponent from "../view/lineDetail/component/LineDetailComponent";
import { AllLines } from "../view/lines/component/AllLines";
import { BusLines } from "../view/lines/component/BusLines";
import LinesViewComponent from "../view/lines/component/LinesViewComponent";
import { MaxLines } from "../view/lines/component/MaxLines";
import { StreetCarLines } from "../view/lines/component/StreetCarLines";
import { WES } from "../view/lines/component/WES";
import MainNavigationContainer from "../view/mainNav/containers/MainNavigationContainer";
import NearbyDirections from "../view/nearby/components/directions/NearbyDirections";
import NearbyView from "../view/nearby/components/nearbyView/NearbyViewComponent";
import { NearbyRoutesComponent } from "../view/nearby/components/nearbyRoutes/NearbyRoutesComponent";
import { NearbySimpleRouteArrivalsComp } from "../view/nearby/components/simpleRouteArrivals/NearbySimpleRouteArrivalsComp";
import { NearbySimpleRoutesComp } from "../view/nearby/components/simpleRoutes/NearbySimpleRoutesComp";
import { NearbyStopDetailComponent } from "../view/nearby/components/stopDetail/NearbyStopDetailComponent";
import { NearbyStopsComponent } from "../view/nearby/components/nearbyStops/NearbyStopsComponent";
import StopLocationViewContainer from "../view/stop/container/StopLocationViewContainer";

function StopLocationViewRouter() {
  const { id } = useParams();

  return <StopLocationViewContainer locationId={parseInt(id, 10)} />;
}

function NearbyRouteDetails() {
  const { id } = useParams();

  return <div>Nearby Route Details</div>;
}

export default function RootAppRoutes() {
  const theme = useSelector((state: RootState) => state.themeReducer.theme);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  // Compute a safe basename for the router.
  // Use PUBLIC_URL (e.g., "/trimet-arrivals") only if the current path starts with it.
  // Otherwise, omit basename so local dev paths like "/nearby/..." work.
  let computedBasename: string | undefined = undefined;
  const path = window.location.pathname || "";
  let candidateBasename: string | undefined = undefined;

  const publicUrl = process.env.PUBLIC_URL;
  if (publicUrl) {
    try {
      candidateBasename = new URL(publicUrl, window.location.origin).pathname;
    } catch {
      candidateBasename = publicUrl; // already a path
    }
  } else {
    candidateBasename = "/trimet-arrivals"; // default for gh-pages
  }

  if (candidateBasename && path.startsWith(candidateBasename)) {
    computedBasename = candidateBasename;
  } else {
    computedBasename = undefined;
  }

  return (
    <Router basename={computedBasename}>
      <MainNavigationContainer />
      <main className="main-view">
        <Routes>
          <Route path="/" element={<SearchHome />} />
          <Route path="nearby" element={<NearbyView />}>
            <Route path="" element={<Navigate to="simple-routes" />} />
            <Route path="simple-routes" element={<NearbySimpleRoutesComp />} />
            <Route
              path="simple-routes/:id"
              element={<NearbySimpleRouteArrivalsComp />}
            />
            <Route path="directions" element={<NearbyDirections />} />
            <Route path="stops" element={<NearbyStopsComponent />} />
            <Route path="stops/:id" element={<NearbyStopDetailComponent />} />
            <Route path="routes" element={<NearbyRoutesComponent />} />
            <Route path="routes/:id" element={<NearbyRouteDetails />} />
          </Route>
          <Route path="/homepage-backup" element={<Home />} />
          <Route path="stop/:id" element={<StopLocationViewRouter />} />
          <Route path="lines" element={<LinesViewComponent />}>
            <Route path="all" element={<AllLines />} />
            <Route path={`max`} element={<MaxLines />} />
            <Route path={`streetcar`} element={<StreetCarLines />} />
            <Route path={`bus`} element={<BusLines />} />
            <Route path={`wes`} element={<WES />} />
            <Route path={`:id`} element={<LineDetailComponent />} />
          </Route>
          <Route path="bookmarks/*" element={<BookmarksViewV2 />} />
        </Routes>
      </main>
    </Router>
  );
}
