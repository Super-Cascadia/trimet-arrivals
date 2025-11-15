import { isEmpty } from "lodash";
import React from "react";
import { Alert, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Alert as IAlert } from "../../api/trimet/interfaces/alertsData";
import Loading from "../loading/Loading";

interface Props {
  systemAlertsData: IAlert[];
}

function getSystemAlerts(systemAlertsData: IAlert[]) {
  if (isEmpty(systemAlertsData)) {
    return <Loading />;
  }

  return systemAlertsData.map(alert => {
    return (
      <Alert key={alert.id} variant="warning">
        <Alert.Heading>{alert.header_text}</Alert.Heading>
        <p className="mb-0">
          <a href={alert.info_link_url} className="alert-link">
            More Info
          </a>
        </p>
      </Alert>
    );
  });

  // <ListGroup className="list-group-flush">
  //   {systemAlertsData &&
  //     systemAlertsData.map(alert => {
  //       return (
  //         <ListGroupItem key={alert.id}>
  //           <small>
  //             {alert.header_text} - {alert.desc}
  //           </small>
  //         </ListGroupItem>
  //       );
  //     })}
  // </ListGroup>
}

export function SystemAlertsCard({ systemAlertsData }: Props) {
  return (
    <Card>
      <Card.Header as="h5">
        <FontAwesome name="bell" />
        System Alerts
      </Card.Header>
      {getSystemAlerts(systemAlertsData)}
    </Card>
  );
}
