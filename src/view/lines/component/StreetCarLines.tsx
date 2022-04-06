import React from "react";
import { Container, Row } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getRoutes, getStreetCarLines } from "./AllLines";

export function StreetCarLines({ routes }: { routes: RouteDataDictionary }) {
  const streetCarLines = getStreetCarLines(routes);

  return (
    <Container>
      <h2>
        <FontAwesome className="train" name="train" />
        Portland Street Car
      </h2>
      <Row xs={1} md={3} className="g-4">
        {getRoutes(streetCarLines)}
      </Row>
    </Container>
  );
}
