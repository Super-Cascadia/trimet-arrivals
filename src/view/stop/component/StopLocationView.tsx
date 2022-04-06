import { map } from "lodash";
import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import {
  TrimetArrivalData,
  TrimetLocation
} from "../../../store/reducers/data/arrivalsDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import ArrivalRowContainer from "../container/ArrivalRowContainer";

interface Props {
  loadArrivalData: (locationId: number) => void;
  locationId: number;
  arrivals: TrimetArrivalData;
}

export default class StopLocationView extends React.Component<Props> {
  private static getLocationInfoPane(
    location: TrimetLocation,
    arrivals: TrimetArrivalData
  ) {
    return (
      <CollapsiblePane className={undefined} title={"Info"} open={true}>
        <ul>
          <li>Direction: {location.dir}</li>
          <li>Queried: {arrivals.queryTime}</li>
          <li>
            Lat / Lng: {location.lat} / {location.lng}
          </li>
          <li>Passenger Code: {location.passengerCode}</li>
        </ul>
      </CollapsiblePane>
    );
  }

  private static getArrivals(arrivals: Arrival[]) {
    return map(arrivals, arrival => {
      return <ArrivalRowContainer arrival={arrival} />;
    });
  }

  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    const arrivals = this.props.arrivals;

    if (!arrivals) {
      return "Loading Arrival Data...";
    }

    const location = arrivals.location[0];

    return (
      <Container>
        <header>
          <h2>
            {location.id} - {location.desc}
          </h2>
        </header>
        <br />
        <Row>
          <Col>{StopLocationView.getLocationInfoPane(location, arrivals)}</Col>
          <Col>
            <CollapsiblePane className={undefined} title={"Map"} open={true}>
              <p>Map goes here</p>
            </CollapsiblePane>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Table striped={true} bordered={true} hover={true} size="lg">
              <tbody>{StopLocationView.getArrivals(arrivals.arrival)}</tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}
