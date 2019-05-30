import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { RouteDataResultSet } from "../../../api/trimet/interfaces/routes";
import { getAllRoutes } from "../../../api/trimet/routeConfig";
import { createRoutesDictionary } from "../../../store/reducers/data/routeDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import { getBusLines, getRoutes } from "./AllLines";

export function BusLines() {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    getAllRoutes().then((data: RouteDataResultSet) => {
      const routesDictionary = createRoutesDictionary(data.route);
      setRoutes(routesDictionary);
    });
  }, []);

  if (isEmpty(routes)) {
    return null;
  }

  const busLines = getBusLines(routes);

  return (
    <Container fluid={true}>
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
