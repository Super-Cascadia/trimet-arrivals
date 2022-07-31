import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import "./NearbyRoutes.scss";

export default function NearbySimpleRouteArrivals() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const stop = searchParams.get("stop");
  const direction = searchParams.get("stop");
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);

  useEffect(() => {
    async function fetchData() {
      if (stop) {
        const arrivals = await getArrivals(stop, 90);
        setArrivalData(arrivals);
      }
    }

    fetchData();
  }, [stop]);

  if (isEmpty(arrivalData)) {
    return null;
  }

  const stopLocation: ArrivalLocation = arrivalData.location[0];

  return (
    <div className="scrollarea">
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav>Foo</Nav>
          <Nav>bar</Nav>
          {id}
          {stop}
          {direction}
        </Container>
      </Navbar>
    </div>
  );
}
