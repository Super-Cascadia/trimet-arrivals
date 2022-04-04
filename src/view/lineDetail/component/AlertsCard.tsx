import { isEmpty } from "lodash";
import moment from "moment";
import React from "react";
import { Badge, Card } from "react-bootstrap";
import { Alert } from "../../../api/trimet/interfaces/alertsData";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import Loading from "../../loading/Loading";

function getLink(alert: Alert) {
  if (!alert.info_link_url) {
    return null;
  }

  return (
    <Card.Link href={alert.info_link_url}>{alert.info_link_url}</Card.Link>
  );
}

function getHeader(alert: Alert) {
  const title = alert.header_text ? (
    alert.header_text
  ) : (
    <span>
      <strong>No Service:</strong> {alert.id}
    </span>
  );
  const systemAlert = alert.system_wide_flag ? (
    <strong>System Alert:</strong>
  ) : null;
  return (
    <>
      <span>{systemAlert}</span>
      <span>{title}</span>
    </>
  );
}

function getDates(alert: Alert) {
  const startDate = moment(alert.begin).format("MM/DD/YY");
  const endDate = alert.end ? moment(alert.end).format("MM/DD/YY") : undefined;

  if (endDate) {
    return (
      <>
        {startDate} to {endDate}
      </>
    );
  }

  return <>Starting: {startDate}</>;
}

function getAlertsContent(alertsData: Alert[]) {
  if (isEmpty(alertsData)) {
    return <Loading />;
  }

  return alertsData.map((alert: Alert) => {
    return (
      <Card bg="warning" className="mb-1" key={alert.id}>
        <Card.Header>{getHeader(alert)}</Card.Header>
        <Card.Body>
          <Card.Text>{alert.desc}</Card.Text>
          {getLink(alert)}
        </Card.Body>
        {alert.route && (
          <Card.Body>
            <Card.Title>Impacted Routes</Card.Title>
            {alert.route &&
              alert.route.map((route: TrimetRoute) => {
                return (
                  <RouteIndicator key={route.route} routeId={route.route} />
                );
              })}
          </Card.Body>
        )}
        {alert.location && (
          <Card.Body>
            <Card.Title>Impacted Stops</Card.Title>
            {alert.location &&
              alert.location.map(location => {
                return (
                  <span key={location.id}>
                    <Badge bg="primary">{location.id}</Badge>
                    {location.desc} - {location.dir}
                  </span>
                );
              })}
          </Card.Body>
        )}
        <Card.Footer className="text-muted">{getDates(alert)}</Card.Footer>
      </Card>
    );
  });
}

interface AlertsCardParams {
  alertsData: Alert[];
}

export function AlertsCard({ alertsData }: AlertsCardParams) {
  return (
    <div>
      <h5>Alerts</h5>
      <div>{getAlertsContent(alertsData)}</div>
    </div>
  );
}
