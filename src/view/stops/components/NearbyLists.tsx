import { size } from "lodash";
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Route as TrimetRoute } from "../../../api/trimet/types";
import ComponentLoadIndicator from "../../../component/loadIndicator/ComponentLoadIndicator";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import { RouteDirectionDict } from "../../../store/reducers/util/getRoutesFromStopLocations";

const NearbyRoutes = lazy(() => import("./NearbyRoutes"));
const Stops = lazy(() => import("./Stops"));

interface Props {
  stopLocations: StopLocationsDictionary;
  nearbyRoutes: RouteDirectionDict;
  openModal: (route: TrimetRoute) => void;
}

interface State {
  modalOpen: boolean;
  routeInfo: TrimetRoute;
}

export default class NearbyLists extends React.Component<Props, State> {
  public render() {
    const { stopLocations, nearbyRoutes, openModal } = this.props;
    const stopCount = size(stopLocations);
    const routeCount = size(nearbyRoutes);

    /*tslint:disable:jsx-no-lambda*/
    return (
      <Suspense fallback={ComponentLoadIndicator()}>
        <Switch>
          <Route
            path={`/nearby/routes`}
            render={() => (
              <NearbyRoutes
                nearbyRoutes={nearbyRoutes}
                stopCount={stopCount}
                routeCount={routeCount}
              />
            )}
          />
          <Route
            path={`/nearby/stops`}
            render={() => (
              <Stops
                stopLocations={stopLocations}
                showArrivals={false}
                onRouteIndicatorClick={openModal}
                stopCount={stopCount}
                routeCount={routeCount}
              />
            )}
          />
          <Route
            exact={true}
            path={`/nearby`}
            render={() => (
              <NearbyRoutes
                nearbyRoutes={nearbyRoutes}
                stopCount={stopCount}
                routeCount={routeCount}
              />
            )}
          />
        </Switch>
      </Suspense>
    );
  }
}
