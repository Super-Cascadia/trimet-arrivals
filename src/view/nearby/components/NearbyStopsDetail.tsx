import { isEmpty, map, sortBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Container,
  Nav,
  Navbar,
  Table
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  Arrival,
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import { getNormalizedDistanceString } from "../util/turfUtils";

function getArrivalRows(data: ArrivalData) {
  const sortedArrivals = sortBy(data.arrival, arrival => arrival.scheduled);
  return map(sortedArrivals, (arrival: Arrival) => {
    const estimatedTime = moment(arrival.estimated).format("h:mma");
    const scheduledTime = moment(arrival.scheduled).format("h:mma");

    return (
      <tr>
        <td>
          <small>{arrival.shortSign}</small>
        </td>
        <td>
          <small>{estimatedTime}</small>
        </td>
        <td>
          <small>{scheduledTime}</small>
        </td>
      </tr>
    );
  });
}

interface Props {
  currentLocation: number[];
}

interface StopArrivalsParams {
  data: ArrivalData;
}

function StopArrivals({ data }: StopArrivalsParams) {
  return (
    <>
      <h5>Arrivals</h5>
      <Table striped={true} bordered={true} hover={true} size="sm">
        <thead>
          <th>Route</th>
          <th>Est. Arrival</th>
          <th>Scheduled</th>
        </thead>
        <tbody>{getArrivalRows(data)}</tbody>
      </Table>
    </>
  );
}

interface StopInfoParams {
  stopLocation: ArrivalLocation;
  distanceDescription: string;
}

function StopInfo({ stopLocation, distanceDescription }: StopInfoParams) {
  return (
    <Card>
      <Card.Header>Info</Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>Stop ID:</strong>
          {stopLocation.id}
        </Card.Text>
        <ButtonToolbar aria-label="Toolbar with button groups">
          <ButtonGroup className="me-2" aria-label="First group">
            <Button variant="primary">Go</Button>
            <Button variant="primary">Info</Button>
          </ButtonGroup>
          <ButtonGroup className="me-2" aria-label="Second group">
            <Button variant="secondary">Bookmark</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </Card.Body>
      <Card.Footer className="text-muted">{distanceDescription}</Card.Footer>
    </Card>
  );
}

export function NearbyStopsDetail({ currentLocation }: Props) {
  const { id } = useParams();
  const [data, setData] = useState<ArrivalData>(null);

  useEffect(() => {
    async function fetchData() {
      const arrivals = await getArrivals(id, 30);
      setData(arrivals);
    }

    fetchData();
  }, [id]);

  if (isEmpty(data)) {
    return null;
  }

  const stopLocation = data.location[0];
  const stopLocationCoords = [stopLocation.lng, stopLocation.lat];
  const distanceDescription = getNormalizedDistanceString(
    currentLocation,
    stopLocationCoords
  );

  return (
    <div>
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav>{stopLocation.desc}</Nav>
          <Nav>
            <LinkContainer to="/nearby/stops">
              <a className="nav-link">Close</a>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <StopInfo
        stopLocation={stopLocation}
        distanceDescription={distanceDescription}
      />
      <br />
      <StopArrivals data={data} />
    </div>
  );
}
