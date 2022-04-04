import { Dictionary } from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import {
  Location,
  StopData,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import {
  getNearbyRouteIds,
  getStopLocations,
  processRoutes
} from "../util/dataUtils";
import NearbyMapV2 from "./NearbyMapV2";
import "./NearbyViewComponent.scss";

const DEFAULT_RADIUS = 1000;

export default function NearbyViewComponent() {
  const navigate = useNavigate();
  const [radiusSize, setRadiusSize] = useState<number>(DEFAULT_RADIUS);
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
    setRadiusSize(e.target.value);
  }

  function handleStopMarkerClick(data: any) {
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

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
          <Outlet
            context={[
              currentLocation,
              nearbyRoutes,
              nearbyStops,
              radiusSize,
              handleRadiusSelectionChange
            ]}
          />
        </Col>
        <Col md={9}>
          {showMap && (
            <NearbyMapV2
              handleStopmarkerClick={handleStopMarkerClick}
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
