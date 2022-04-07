import { sortBy, uniq } from "lodash";
import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { TrimetArrivalData } from "../../../store/reducers/data/arrivalsDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import StopLocationArrivalsTable from "./StopLocationArrivalsTable";
import StopLocationArrivalsTableNav from "./StopLocationArrivalsTableNav";
import LocationInfoPane from "./StopLocationInfoPane";

interface Props {
  loadArrivalData: (locationId: number) => void;
  locationId: number;
  arrivals: TrimetArrivalData;
}

export default class StopLocationView extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    const arrivals = this.props.arrivals;

    if (!arrivals) {
      return "Loading Arrival Data...";
    }

    const location = arrivals.location[0];
    const routes = sortBy(uniq(arrivals.arrival.map(arrival => arrival.route)));

    return (
      <Container>
        <br />
        <Row>
          <header>
            <span>
              <h2 className="display-3">{location.desc}</h2>
            </span>
          </header>
          <hr />
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
              <p>Map goes here</p>
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
            <StopLocationArrivalsTable arrivals={arrivals} />
          </Col>
        </Row>
      </Container>
    );
  }
}
