import { sortBy, uniq } from "lodash";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import Map, { LatLngCoords } from "../../../component/map/Map";
import { TrimetArrivalData } from "../../../store/reducers/data/arrivalsDataReducer";
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
  loadArrivalData: (locationId: number) => void;
  stopIsBookmarked: boolean;
  onBookmarkClick: OnBookmarkClick;
  locationId: number;
  arrivals: TrimetArrivalData;
}

export default class StopLocationView extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    const { arrivals, onBookmarkClick, stopIsBookmarked } = this.props;

    if (!arrivals) {
      return <Loading />;
    }

    const location = arrivals.location[0];
    const routes = sortBy(uniq(arrivals.arrival.map(arrival => arrival.route)));

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
            <LocationInfoPane
              location={location}
              arrivals={arrivals}
              routes={routes}
            />
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
            <StopLocationArrivals arrivals={arrivals} />
          </Col>
        </Row>
      </Container>
    );
  }
}
