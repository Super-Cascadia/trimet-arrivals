import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Navbar
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import { getNormalizedDistanceString } from "../util/turfUtils";
import StopInfo from "./common/StopInfo";
import StopArrivals from "./NearbyStopArrivals";

interface Props {
  currentLocation: number[];
  handleStopOpened: (stopLocation: ArrivalLocation) => void;
}

interface StopInfoParams {
  stopLocation: ArrivalLocation;
  distanceDescription: string;
}

// function StopInfo({ stopLocation, distanceDescription }: StopInfoParams) {
//   return (
//     <Card>
//       <Card.Header>Info</Card.Header>
//       <Card.Body>
//         <Card.Text>
//           <strong>Stop ID:</strong>
//           {stopLocation.id}
//         </Card.Text>
//         <ButtonToolbar aria-label="Toolbar with button groups">
//           <ButtonGroup className="me-2" aria-label="First group">
//             <Button variant="success">Go</Button>
//             <Button variant="primary">Info</Button>
//           </ButtonGroup>
//           <ButtonGroup className="me-2" aria-label="Second group">
//             <Button variant="secondary">Bookmark</Button>
//           </ButtonGroup>
//         </ButtonToolbar>
//       </Card.Body>
//       <Card.Footer className="text-muted">{distanceDescription}</Card.Footer>
//     </Card>
//   );
// }

export function NearbyStopsDetail({ currentLocation, handleStopOpened }: Props) {
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
    <div className="scrollarea">
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav>{stopLocation.desc}</Nav>
          <Nav>
            <LinkContainer to="/nearby/stops">
              <a className="nav-link">Back</a>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <StopInfo stopLocation={stopLocation} />
      <br />
      <StopArrivals data={data} />
    </div>
  );
}
