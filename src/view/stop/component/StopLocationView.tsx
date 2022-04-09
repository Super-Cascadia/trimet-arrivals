import { sortBy, uniq } from "lodash";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Map, { LatLngCoords } from "../../../component/map/Map";
import {
  TrimetArrivalData,
  TrimetLocation
} from "../../../store/reducers/data/arrivalsDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import Loading from "../../loading/Loading";
import StopLocationArrivals from "./StopLocationArrivals";
import StopLocationArrivalsTableNav from "./StopLocationArrivalsTableNav";
import LocationInfoPane from "./StopLocationInfoPane";

interface Props {
  loadArrivalData: (locationId: number) => void;
  bookmarkByLocationId: (locationId: number) => void;
  locationId: number;
  arrivals: TrimetArrivalData;
}

interface StopLocationHeaderProps {
  location: TrimetLocation;
  bookmarkByLocationId: (locationId: number) => void;
}

function StopLocationHeader({
  location,
  bookmarkByLocationId
}: StopLocationHeaderProps) {
  function onClick() {
    bookmarkByLocationId(location.id);
  }

  return (
    <>
      <header className="d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3">
        <h2 className="display-6">{location.desc}</h2>
        <Button
          className="mb-2 mb-md-0"
          variant="outline-secondary"
          onClick={onClick}
        >
          Bookmark
        </Button>
      </header>
      <hr />
    </>
  );
}

export default class StopLocationView extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    const { arrivals, bookmarkByLocationId } = this.props;

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
            bookmarkByLocationId={bookmarkByLocationId}
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
