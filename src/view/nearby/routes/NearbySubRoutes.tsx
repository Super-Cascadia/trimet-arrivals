import { Dictionary, size } from "lodash";
import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { StopData, TrimetRoute } from "../../../api/trimet/interfaces/types";
import NearbyRouteDetailContainer from "../../nearbyRouteDetail/containers/NearbyRouteDetailContainer";
import NearbyRoutes from "../components/NearbyRoutes";
import NearbySimpleRoutes from "../components/NearbySimpleRoutes";
import NearbyStops from "../components/NearbyStops";
import { NearbyStopsDetail } from "../components/NearbyStopsDetail";
import StopArrivalDetail from "../components/StopArrivalDetail";
import NearbySimpleRouteArrivals from "../components/NearbySimpleRouteArrivals";

function NearbyRouteDetailRouter() {
  const { id } = useParams();

  return <NearbyRouteDetailContainer id={id} />;
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
  const { path } = useRouteMatch();
  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutes
          radiusSize={radiusSize}
          nearbyRoutes={nearbyRoutes}
          stopCount={stopCount}
          routeCount={routeCount}
          handleRadiusSelectionChange={handleRadiusSelectionChange}
        />
      </Route>
      <Route path={`${path}/routes/:id`}>
        <NearbyRouteDetailRouter />
      </Route>
      <Route path={`${path}/simple-routes/:id`}>
        <NearbySimpleRouteArrivals />
      </Route>
      <Route path={`${path}/simple-routes`}>
        <br />
        <NearbySimpleRoutes
          nearbyStops={nearbyStops}
          nearbyRoutes={nearbyRoutes}
          radiusSize={radiusSize}
          handleRadiusSelectionChange={handleRadiusSelectionChange}
          routeCount={routeCount}
          stopCount={stopCount}
        />
      </Route>
      <Route path={`${path}/routes`}>
        <br />
        <NearbyRoutes
          radiusSize={radiusSize}
          nearbyRoutes={nearbyRoutes}
          stopCount={stopCount}
          routeCount={routeCount}
          handleRadiusSelectionChange={handleRadiusSelectionChange}
        />
      </Route>
      <Route path={`${path}/stops/:id/arrival/:arrivalId`}>
        <StopArrivalDetail />
      </Route>
      <Route path={`${path}/stops/:id`}>
        <NearbyStopsDetail currentLocation={currentLocation} />
      </Route>
      <Route path={`${path}/stops`}>
        <br />
        <NearbyStops
          currentLocation={currentLocation}
          radiusSize={radiusSize}
          nearbyStops={nearbyStops}
          stopCount={stopCount}
          routeCount={routeCount}
          handleRadiusSelectionChange={handleRadiusSelectionChange}
        />
      </Route>
    </Switch>
  );
}
