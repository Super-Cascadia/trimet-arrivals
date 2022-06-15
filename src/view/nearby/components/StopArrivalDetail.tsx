import { find, isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Container,
  ListGroup,
  Nav,
  Navbar
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { getNormalizedDistanceFromFeet } from "../util/turfUtils";
import {
  getFormattedTime,
  getNormalizedTimeDifference,
  getTimeDifferenceInMinutes
} from "./NearbyStopArrivals";

interface BooleanBadgeParams {
  status: boolean;
}

function BooleanBadge({ status }: BooleanBadgeParams) {
  if (status) {
    return (
      <Badge bg="primary" pill={true}>
        Yes
      </Badge>
    );
  } else {
    return (
      <Badge bg="secondary" pill={true}>
        No
      </Badge>
    );
  }
}

export function StopArrivalDetail() {
  const { id, arrivalId } = useParams();
  const [data, setData] = useState<ArrivalData>(null);

  useEffect(() => {
    async function fetchData() {
      const arrivals = await getArrivals(id, 90);
      setData(arrivals);
    }

    fetchData();
  }, [id]);

  if (isEmpty(data)) {
    return null;
  }

  const foundArrival: Arrival = find<Arrival[]>(
    data.arrival,
    (arrival: Arrival) => arrival.id
  ) as Arrival;

  console.log(id, arrivalId, foundArrival);

  const estimatedTime = getFormattedTime(foundArrival.estimated);
  const scheduledTime = getFormattedTime(foundArrival.scheduled);
  const now = moment();
  const timeDiff = getNormalizedTimeDifference(foundArrival.estimated, now);

  return (
    <div>
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav>{foundArrival.shortSign}</Nav>
          <Nav>
            <LinkContainer to={`/nearby/stops/${id}`}>
              <a className="nav-link">Back</a>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <Card>
        <Card.Header>Trip Info</Card.Header>
        <Card.Body>
          <Card.Text>{foundArrival.status}</Card.Text>
          <Card.Text>
            <Badge bg="primary" pill={true}>
              {timeDiff}
            </Badge>
            {estimatedTime} / {scheduledTime}
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Header>Vehicle Info</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Vehicle ID:</strong> {foundArrival.vehicleID}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Distance From Stop:</strong>{" "}
            {getNormalizedDistanceFromFeet(foundArrival.feet)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Detoured:</strong>{" "}
            <BooleanBadge status={foundArrival.detoured} />
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Drop off only:</strong>
            <BooleanBadge status={foundArrival.dropOffOnly} />
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>In Congestion:</strong>
            <BooleanBadge status={foundArrival.inCongestion} />
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}

export default StopArrivalDetail;
