import { Dictionary, size } from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import {
  Location,
  StopData,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import NearbySubRoutes from "../../../routes/NearbySubRoutes";
import {
  getNearbyRouteIds,
  getStopLocations,
  processRoutes
} from "../util/dataUtils";
import NearbyMapV2 from "./NearbyMapV2";
import NearbySubNav from "./NearbySubNav";
import "./NearbyViewComponent.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

export default function NearbyViewComponent() {
  const radius = 1000;
  const [radiusSize, setRadiusSize] = useState<number>(radius);
  const [nearbyStops, setNearbyStopData] = useState<StopData>(undefined);
  const [nearbyRoutes, setNearbyRoutesData] = useState<
    Dictionary<TrimetRoute[]>
  >(undefined);
  const [userLocation, setUserLocation] = useState<Location>(undefined);

  useEffect(() => {
    async function fetchData() {
      // console.info("effect: fetchData");

      if (userLocation) {
        getNearbyStops(userLocation, radiusSize).then((stopData: StopData) => {
          const routes = processRoutes(stopData);

          // console.log("effect: fetchData: stopData", stopData);
          // console.log("effect: fetchData: routes", routes);

          setNearbyStopData(stopData);
          setNearbyRoutesData(routes);
        });
      } else {
        geoLocateCurrentPosition().then((location: Location) => {
          setUserLocation(location);
          getNearbyStops(location, radiusSize).then((stopData: StopData) => {
            setNearbyStopData(stopData);
            const routes = processRoutes(stopData);
            setNearbyRoutesData(routes);
          });
        });
      }
    }

    fetchData();
  }, [radiusSize]);

  function handleRadiusSelectionChange(e) {
    // console.log("set radius", e.target.value);
    setRadiusSize(e.target.value);
  }

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);
  const currentLocation = [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ];
  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = currentLocation && nearbyRouteIds && stopLocations;

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}>
          <SearchRadiusSelection
            radiusSize={radiusSize}
            handleRadiusSelectionChange={handleRadiusSelectionChange}
          />
          <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
          <div className="scrollarea">
            <NearbySubRoutes
              nearbyStops={nearbyStops}
              nearbyRoutes={nearbyRoutes}
            />
          </div>
        </Col>
        <Col md={9}>
          {showMap && (
            <NearbyMapV2
              radiusSize={radiusSize}
              currentLocation={currentLocation}
              nearbyRouteIds={nearbyRouteIds}
              stopLocations={stopLocations}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
