import {
  filter,
  find,
  findIndex,
  isEmpty,
  last,
  map,
  slice,
  split,
  toNumber
} from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar
} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { useParams } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  Arrival,
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import {
  RouteDataResultSet,
  RouteDirectionStop
} from "../../../api/trimet/interfaces/routes";
import {
  getRouteById,
  getRouteByIdAndDirection,
  getSubsequentRouteStops
} from "../../../api/trimet/routeConfig";
import { getTimeUntilArrival } from "../util/timeUtils";
import RouteStopInfo from "./common/RouteStopInfo";
import "./NearbyRoutes.scss";

interface DeparturesCardParams {
  filteredArrivals: Arrival[];
}

function DeparturesCard({ filteredArrivals }: DeparturesCardParams) {
  return (
    <Card>
      <Card.Header>Departures</Card.Header>
      <ListGroup className="list-group-flush">
        {map(filteredArrivals, (arrival: any, index: number) => {
          const estimatedArrivalTime = arrival.estimated;
          const scheduledArrivalTime = arrival.scheduled;
          const timeUntilArrival = getTimeUntilArrival(
            estimatedArrivalTime,
            scheduledArrivalTime
          );

          const variant = index === 0 ? "primary" : "light";
          const estimatedTime = moment(estimatedArrivalTime).format("h:mm a");
          const scheduledTime = moment(scheduledArrivalTime).format("h:mm a");
          const arrivalTime = estimatedArrivalTime
            ? estimatedTime
            : scheduledTime;

          return (
            <ListGroup.Item
              key={index}
              variant={variant}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <span>
                {index === 0 && <FontAwesome name="caret-right" />}
                {timeUntilArrival}
              </span>
              <small>{arrivalTime}</small>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}

interface TopNavBarParams {
  id: string;
}

function TopNavBar({ id }: TopNavBarParams) {
  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Nav as="h2">{id}</Nav>
        <Nav>
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">Back</a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

interface InfoCardParams {
  id: string;
}

function InfoCard({ id }: InfoCardParams) {
  return (
    <Card>
      {/*<Card.Header>Stop Info</Card.Header>*/}
      <Card.Body>
        <Card.Title as="h6">{id} schedule:</Card.Title>
        <Card.Text>5:00 to 23:30</Card.Text>
        <hr />
        <Card.Title as="h6">Stop also serves:</Card.Title>
        <Card.Text>56, 54</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default function NearbySimpleRouteArrivals() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const stop = searchParams.get("stop");
  const direction = searchParams.get("direction");
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);
  const [filteredArrivalData, setFilteredArrivalData] = useState<Arrival[]>(
    null
  );
  const [routeStopsData, setRouteStopsData] = useState<RouteDataResultSet>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      if (stop) {
        const arrivals = await getArrivals(stop, 1000);
        setArrivalData(arrivals);

        const filteredArrivals: Arrival[] = filter(
          arrivals.arrival,
          (arrival: Arrival) => {
            return arrival.route === toNumber(id);
          }
        );

        setFilteredArrivalData(filteredArrivals);

        const routeStops = await getRouteByIdAndDirection(
          toNumber(id),
          toNumber(direction)
        );
        setRouteStopsData(routeStops);
      }
    }

    fetchData();
  }, [stop]);

  if (isEmpty(filteredArrivalData) || isEmpty(routeStopsData)) {
    return null;
  }

  const stopLocation: ArrivalLocation = arrivalData.location[0];
  const shortSign = last(split(filteredArrivalData[0].shortSign, "To"));
  const routeStops = routeStopsData.route[0].dir[0].stop;
  const stopIndex = findIndex(
    routeStops,
    (routeDirectionStop: RouteDirectionStop, index) => {
      return routeDirectionStop.locid === toNumber(stop);
    }
  );

  const remainingStopsOnRoute = slice(routeStops, stopIndex + 1);

  return (
    <div className="scrollarea">
      <TopNavBar id={id} />
      <br />
      <RouteStopInfo shortSign={shortSign} stopLocation={stopLocation} />
      <br />
      <DeparturesCard filteredArrivals={filteredArrivalData} />
      <br />
      <Card>
        <Card.Header>Stops on Route</Card.Header>
        <ListGroup className="list-group-flush">
          {map(
            remainingStopsOnRoute,
            (routeDirectionStop: RouteDirectionStop) => {
              return (
                <ListGroupItem>
                  <small>{routeDirectionStop.desc}</small>
                  <small className="text-muted">
                    {" "}
                    ({routeDirectionStop.locid})
                  </small>
                </ListGroupItem>
              );
            }
          )}
        </ListGroup>
      </Card>
      <br />
      <InfoCard id={id} />
    </div>
  );
}
