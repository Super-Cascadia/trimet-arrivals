import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import { getNormalizedDistanceString } from "../util/turfUtils";
import { ArrivalList } from "./NearbyStopArrivals";

interface Props {
  currentLocation: number[];
  handleStopOpened: (stopLocation: ArrivalLocation) => void;
}

/**
 * Component that displays detailed information about a specific nearby transit stop.
 * 
 * Fetches and displays arrival data for a selected stop, including location information
 * and upcoming arrivals. The component also handles navigation back to the stops list.
 * 
 * @param currentLocation - The user's current location as [longitude, latitude]
 * @param handleStopOpened - Callback function triggered when a stop is opened, receives the stop location data
 * 
 * @example
 * ```tsx
 * <NearbyStopsDetail 
 *   currentLocation={[-122.6765, 45.5231]} 
 *   handleStopOpened={(location) => console.log(location)} 
 * />
 * ```
 */
export function NearbyStopsDetail({
  currentLocation,
  handleStopOpened
}: Props) {
  const { id } = useParams();
  const [data, setData] = useState<ArrivalData>(null);

  useEffect(() => {
    async function fetchData() {
      const arrivals = await getArrivals(id, 90);
      const stopLocation = arrivals.location[0];
      handleStopOpened(stopLocation);
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
    <div className="scrollarea nearby-stop-detail">
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav className="align-items-center">
            <StopLocationIndicator locationId={stopLocation.id} />
            <span className="ms-2 navbar-text text-white">
              {stopLocation.desc}
            </span>
          </Nav>
          <Nav>
            <LinkContainer to="/nearby/stops">
              <a className="nav-link">Back</a>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <ArrivalList data={data} />
    </div>
  );
}
