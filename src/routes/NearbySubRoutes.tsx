import { Dictionary, size, toNumber } from "lodash";
import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { StopData, TrimetRoute } from "../api/trimet/interfaces/types";
import NearbyRoutes from "../view/nearby/components/NearbyRoutes";
import NearbySimpleRouteArrivals from "../view/nearby/components/NearbySimpleRouteArrivals";
import NearbySimpleRoutes from "../view/nearby/components/NearbySimpleRoutes";
import NearbyStops from "../view/nearby/components/NearbyStops";
import { NearbyStopsDetail } from "../view/nearby/components/NearbyStopsDetail";
import StopArrivalDetail from "../view/nearby/components/StopArrivalDetail";
import NearbyRouteDetailContainer from "../view/nearbyRouteDetail/containers/NearbyRouteDetailContainer";

function NearbyRouteDetailRouter() {
  const { id } = useParams();

  return <NearbyRouteDetailContainer id={toNumber(id)} />;
}

interface Props {
  nearbyStops: StopData;
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  currentLocation: number[];
}

export default function NearbySubRoutes({
  nearbyStops,
  nearbyRoutes,
  handleRadiusSelectionChange,
  radiusSize,
  currentLocation
}: Props) {
  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  const NearbyRoutesComponent = (
    <NearbyRoutes
      radiusSize={radiusSize}
      nearbyRoutes={nearbyRoutes}
      stopCount={stopCount}
      routeCount={routeCount}
      handleRadiusSelectionChange={handleRadiusSelectionChange}
    />
  );

  const NearbySimpleRoutesComponent = (
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

  const NearbyStopsComponent = () => {
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
  };

  const NearbyStopDetailComponent = (
    <NearbyStopsDetail currentLocation={currentLocation} />
  );

  return (
    <Routes>
      {/*<Route path="/" element={NearbyRoutesComponent} />*/}
      <Route path="routes" element={NearbyRoutesComponent}>
        <Route path=":id" element={<NearbyRouteDetailRouter />} />
      </Route>
      <Route path="simple-routes" element={NearbySimpleRoutesComponent}>
        <Route path=":id/arrivals" element={<NearbySimpleRouteArrivals />} />
      </Route>
      <Route path="stops" element={NearbyStopsComponent}>
        <Route path=":id" element={NearbyStopDetailComponent}>
          <Route path="arrival/:arrivalId" element={<StopArrivalDetail />} />
        </Route>
      </Route>
      <Route path="arrivals"/>
    </Routes>
  );
}
