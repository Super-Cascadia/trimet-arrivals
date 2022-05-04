import { sortBy, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { getAlertsByLocationId } from "../../../api/trimet/alerts";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Alert, AlertsData } from "../../../api/trimet/interfaces/alertsData";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import Map, { LatLngCoords } from "../../../component/map/Map";
import { AlertsCard } from "../../lineDetail/component/AlertsCard";
import Loading from "../../loading/Loading";
import StopLocationArrivals from "./StopLocationArrivals";
import StopLocationArrivalsTableNav from "./StopLocationArrivalsTableNav";
import StopLocationHeader from "./StopLocationHeader";
import LocationInfoPane from "./StopLocationInfoPane";

export type OnBookmarkClick = (
  stopLocation: StopLocation,
  stopIsBookmarked: boolean
) => void;

interface Props {
  stopIsBookmarked: boolean;
  onBookmarkClick: OnBookmarkClick;
  locationId: number;
}

interface MapCardParams {
  coordinates: number[];
}

function MapCard({ coordinates }: MapCardParams) {
  return (
    <Card>
      <Card.Header as="h5">Map</Card.Header>
      <Card.Body>
        <Card.Text>
          <Map currentLocation={coordinates} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default function StopLocationView(props: Props) {
  const { onBookmarkClick, stopIsBookmarked, locationId } = props;
  const [arrivalData, setArrivalData] = useState<ArrivalData>(undefined);
  const [alertsData, setAlertsData] = useState<Alert[]>(undefined);

  useEffect(() => {
    const locIDs = locationId.toString(10);
    getArrivals(locIDs, 45).then(results => {
      setArrivalData(results);
    });

    getAlertsByLocationId(locationId).then((result: AlertsData) => {
      setAlertsData(result.alert);
    });
  }, []);

  if (!arrivalData) {
    return <Loading />;
  }

  const location = arrivalData.location[0];
  const routes = sortBy(
    uniq(arrivalData.arrival.map(arrival => arrival.route))
  );

  const coordinates: LatLngCoords = [location.lng, location.lat];
  return (
    <Container>
      <br />
      <Row>
        <StopLocationHeader
          location={location}
          onBookmarkClick={onBookmarkClick}
          stopIsBookmarked={stopIsBookmarked}
        />
      </Row>
      <br />
      <Row>
        <Col md="3">
          <LocationInfoPane arrivalData={arrivalData} />
          <br />
          <AlertsCard alertsData={alertsData} />
        </Col>
        <Col md="9">
          <StopLocationArrivalsTableNav
            routes={routes}
            locationId={location.id}
          />
          <br />
          <StopLocationArrivals arrivalData={arrivalData} />
          <br />
          <MapCard coordinates={coordinates} />
        </Col>
      </Row>
    </Container>
  );
}
