import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getAlertsByRouteId } from "../../../api/trimet/alerts";
import { Alert, AlertsData } from "../../../api/trimet/interfaces/alertsData";
import {
  RouteDataResultSet,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import { getRouteById } from "../../../api/trimet/routeConfig";
import RouteListItem from "../../../component/route/RouteListItem";
import { maxLightRail } from "../../../data/trimet/schedules/maxLightRail";
import Loading from "../../loading/Loading";
import { AlertsCard } from "./AlertsCard";
import "./LineDetailView.scss";
import { MapCard } from "./MapCard";
import { ScheduleCard } from "./ScheduleCard";
import { StopsCard } from "./StopsCard";

interface Props {
  route: TrimetRoute;
  id: number;
  loadRouteData: (id: number) => {};
}

export default function LinesViewComponent(props: Props) {
  const { id } = props;
  const [route, setRouteData] = useState<TrimetRoute>(undefined);
  const [alertsData, setAlertsData] = useState<Alert[]>(undefined);

  useEffect(() => {
    getRouteById(id).then((results: RouteDataResultSet) => {
      setRouteData(results.route[0]);
    });

    getAlertsByRouteId(id).then((result: AlertsData) => {
      setAlertsData(result.alert);
    });
  }, []);

  if (!route) {
    return <Loading />;
  }

  const routeSchedule = maxLightRail[id];

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <RouteListItem route={route} />
        </Col>
      </Row>
      <br />
      <Row>
        <Col md="3">
          <ScheduleCard routeSchedule={routeSchedule} route={route} />
          <br />
          <MapCard />
          <br />
          <AlertsCard alertsData={alertsData} />
        </Col>
        <Col md="9">
          <StopsCard route={route} alertsData={alertsData} />
        </Col>
      </Row>
    </Container>
  );
}
