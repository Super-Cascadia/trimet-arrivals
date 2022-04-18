import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getAlertsByRouteId } from "../../../api/trimet/alerts";
import {
  RouteDataResultSet,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import { getRouteById } from "../../../api/trimet/routeConfig";
import FrequentServiceIndicator from "../../../component/route/FrequentServiceIndicator";
import RouteListItem from "../../../component/route/RouteListItem";
import {
  LineScheduleInfo,
  maxLightRail
} from "../../../data/trimet/schedules/maxLightRail";
import Loading from "../../loading/Loading";
import CollapsiblePane from "./CollapsiblePane";
import "./LineDetailView.scss";
import LineDetailViewStops from "./LineDetailViewStops";

interface Props {
  route: TrimetRoute;
  id: number;
  loadRouteData: (id: number) => {};
}

function getScheduleContent(schedule: LineScheduleInfo) {
  return (
    <>
      {schedule && schedule.frequentService && (
        <FrequentServiceIndicator frequentService={schedule.frequentService} />
      )}
      <strong>Hours of Operation:</strong> 5:00 AM - 12:00 PM
      <br />
      <strong>Connections:</strong>
      <br />
      <strong>Areas served:</strong>
    </>
  );
}

export default function LinesViewComponent(props: Props) {
  const { id } = props;

  const [route, setRouteData] = useState(undefined);
  const [alertsData, setAlertsData] = useState(undefined);

  useEffect(() => {
    getRouteById(id).then((results: RouteDataResultSet) => {
      setRouteData(results.route[0]);
    });

    getAlertsByRouteId(id).then(result => setAlertsData(result));
  }, []);

  if (!route) {
    return <Loading />;
  }

  const routeSchedule = maxLightRail[id];

  return (
    <Container>
      <Row>
        <Col>
          <RouteListItem route={route} />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <CollapsiblePane
            className="route-detail-information-pane"
            title="Schedule"
            open={true}
          >
            {getScheduleContent(routeSchedule)}
          </CollapsiblePane>
        </Col>
        <Col>
          <CollapsiblePane
            className="route-detail-map"
            title={"Map"}
            open={true}
          >
            <p>Map goes here</p>
          </CollapsiblePane>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <CollapsiblePane
            className="route-detail-stops"
            title="Stops"
            open={true}
          >
            <LineDetailViewStops route={route} />
          </CollapsiblePane>
        </Col>
      </Row>
    </Container>
  );
}
