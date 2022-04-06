import React from "react";
import { Container, Row } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getMaxLines, getRoutes } from "./AllLines";

export function MaxLines({ routes }: { routes: RouteDataDictionary }) {
  const lines = getMaxLines(routes);

  return (
    <Container>
      <h2>
        <FontAwesome className="train" name="train" />
        Max Light Rail
      </h2>
      <Row xs={1} md={3} className="g-4">
        {getRoutes(lines)}
      </Row>
    </Container>
  );
}
