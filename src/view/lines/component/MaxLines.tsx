import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { RouteDataResultSet } from "../../../api/trimet/interfaces/routes";
import { getAllRoutes } from "../../../api/trimet/routeConfig";
import { createRoutesDictionary } from "../../../store/reducers/data/routeDataReducer";
import Loading from "../../loading/Loading";
import { getMaxLines, getRoutes } from "./AllLines";

export function MaxLines() {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    getAllRoutes().then((data: RouteDataResultSet) => {
      const routesDictionary = createRoutesDictionary(data.route);
      setRoutes(routesDictionary);
    });
  }, []);

  if (isEmpty(routes)) {
    return <Loading />;
  }

  const lines = getMaxLines(routes);

  return (
    <Container>
      <Row xs={1} md={3} className="g-4">
        {getRoutes(lines)}
      </Row>
    </Container>
  );
}
