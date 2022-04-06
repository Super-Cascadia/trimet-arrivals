import React from "react";
import { Container, Row } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import { getBusLines, getRoutes } from "./AllLines";

export function BusLines({ routes }: { routes: RouteDataDictionary }) {
  const busLines = getBusLines(routes);

  return (
    <Container>
      <h2>
        <FontAwesome className="bus" name="bus" />
        Max Bus
      </h2>
      <CollapsiblePane
        className="route-detail-information-pane"
        title="Schedule"
        open={true}
      >
        <p>
          Some lines offer <strong>Frequent Service</strong>, others provide{" "}
          <strong>24-hour Service</strong> all days of the week.
        </p>
      </CollapsiblePane>
      <br />
      <Row xs={1} md={4} className="g-4">
        {getRoutes(busLines)}
      </Row>
    </Container>
  );
}
