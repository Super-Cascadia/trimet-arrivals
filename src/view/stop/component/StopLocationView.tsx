import { sortBy, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getArrivals } from "../../../api/trimet/arrivals";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import Map, { LatLngCoords } from "../../../component/map/Map";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
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

export default function StopLocationView(props: Props) {
  const { onBookmarkClick, stopIsBookmarked, locationId } = props;
  const [arrivalData, setArrivalData] = useState<ArrivalData>(undefined);

  useEffect(() => {
    const locIDs = locationId.toString(10);
    getArrivals(locIDs, 45).then(results => {
      setArrivalData(results);
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
        <Col>
          <LocationInfoPane arrivalData={arrivalData} />
        </Col>
        <Col>
          <CollapsiblePane className={undefined} title={"Map"} open={true}>
            <Map currentLocation={coordinates} />
          </CollapsiblePane>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <StopLocationArrivalsTableNav
            routes={routes}
            locationId={location.id}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <StopLocationArrivals arrivalData={arrivalData} />
        </Col>
      </Row>
    </Container>
  );
}
