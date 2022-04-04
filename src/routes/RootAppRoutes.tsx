import { size } from "lodash";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useOutletContext,
  useParams
} from "react-router-dom";
import BookmarksViewContainer from "../view/bookmarks/container/BookmarksViewContainer";
import Home from "../view/home/Home";
import LineDetailComponent from "../view/lineDetail/component/LineDetailComponent";
import { AllLines } from "../view/lines/component/AllLines";
import { BusLines } from "../view/lines/component/BusLines";
import LinesViewComponent from "../view/lines/component/LinesViewComponent";
import { MaxLines } from "../view/lines/component/MaxLines";
import { StreetCarLines } from "../view/lines/component/StreetCarLines";
import { WES } from "../view/lines/component/WES";
import MainNavigationContainer from "../view/mainNav/containers/MainNavigationContainer";
import NearbyDirections from "../view/nearby/components/NearbyDirections";
import NearbyRoutes from "../view/nearby/components/NearbyRoutes";
import NearbySimpleRouteArrivals from "../view/nearby/components/NearbySimpleRouteArrivals";
import NearbySimpleRoutes from "../view/nearby/components/NearbySimpleRoutes";
import NearbyStops from "../view/nearby/components/NearbyStops";
import { NearbyStopsDetail } from "../view/nearby/components/NearbyStopsDetail";
import NearbyView from "../view/nearby/components/NearbyViewComponent";
import StopLocationViewContainer from "../view/stop/container/StopLocationViewContainer";

function StopLocationViewRouter() {
  const { id } = useParams();

  return <StopLocationViewContainer locationId={parseInt(id, 10)} />;
}

function NearbyStopDetailComponent() {
  const [currentLocation] = useOutletContext();
  return <NearbyStopsDetail currentLocation={currentLocation} />;
}

function NearbyStopsComponent() {
  const [
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange
  ] = useOutletContext();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <div>
      <br />
      <NearbyStops
        currentLocation={currentLocation}
        radiusSize={radiusSize}
        nearbyStops={nearbyStops}
        stopCount={stopCount}
        routeCount={routeCount}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
    </div>
  );
}

function NearbyRoutesComponent() {
  const [
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange
  ] = useOutletContext();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <NearbyRoutes
      radiusSize={radiusSize}
      nearbyRoutes={nearbyRoutes}
      stopCount={stopCount}
      routeCount={routeCount}
      handleRadiusSelectionChange={handleRadiusSelectionChange}
    />
  );
}

function NearbySimpleRoutesComp() {
  const [
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange
  ] = useOutletContext();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <div>
      <br />
      <NearbySimpleRoutes
        nearbyStops={nearbyStops}
        nearbyRoutes={nearbyRoutes}
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        routeCount={routeCount}
        stopCount={stopCount}
      />
    </div>
  );
}

function NearbyRouteDetails() {
  const { id } = useParams();

  return <div>Nearby Route Details</div>;
}

export default function RootAppRoutes() {
  return (
    <Router>
      <MainNavigationContainer />
      <main className="main-view">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="nearby" element={<NearbyView />}>
            <Route path="simple-routes" element={<NearbySimpleRoutesComp />} />
            <Route
              path="simple-routes/:id"
              element={<NearbySimpleRouteArrivals />}
            />
            <Route path="directions" element={<NearbyDirections />} />
            <Route path="stops" element={<NearbyStopsComponent />} />
            <Route path="stops/:id" element={<NearbyStopDetailComponent />} />
            <Route path="routes" element={<NearbyRoutesComponent />} />
            <Route path="routes/:id" element={<NearbyRouteDetails />} />
          </Route>
          <Route path="stop/:id" element={<StopLocationViewRouter />} />
          <Route path="lines" element={<LinesViewComponent />}>
            <Route path="all" element={<AllLines />} />
            <Route path={`max`} element={<MaxLines />} />
            <Route path={`streetcar`} element={<StreetCarLines />} />
            <Route path={`bus`} element={<BusLines />} />
            <Route path={`wes`} element={<WES />} />
            <Route path={`:id`} element={<LineDetailComponent />} />
          </Route>
          <Route path="bookmarks/*" element={<BookmarksViewContainer />} />
        </Routes>
      </main>
    </Router>
  );
}
