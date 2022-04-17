import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Alert } from "../../api/trimet/interfaces/alertsData";

interface Props {
  systemAlertsData: Alert[];
}

export function SystemAlertsCard({ systemAlertsData }: Props) {
  return (
    <Card>
      <Card.Header>System Alerts</Card.Header>
      <ListGroup className="list-group-flush">
        {systemAlertsData &&
          systemAlertsData.map(alert => {
            return (
              <ListGroupItem key={alert.id}>
                <small>
                  {alert.header_text} - {alert.desc}
                </small>
              </ListGroupItem>
            );
          })}
      </ListGroup>
    </Card>
  );
}
