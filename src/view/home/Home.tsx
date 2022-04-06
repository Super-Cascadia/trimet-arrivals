import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row
} from "react-bootstrap";
import { getSytemAlerts } from "../../api/trimet/alerts";

function Home() {
  const [alertsData, setAlertsData] = useState(undefined);
  const [systemAlertsData, setSystemAlertsData] = useState(undefined);

  useEffect(() => {
    getSytemAlerts().then(result => {
      const alerts = result.alert;

      const systemAlerts = alerts.filter(
        alert => alert.system_wide_flag === true
      );
      const nonSystemAlerts = alerts.filter(
        alert => alert.system_wide_flag !== true
      );

      setAlertsData(nonSystemAlerts);
      setSystemAlertsData(systemAlerts);

      // console.log(result);
    });
  }, []);

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Card>
            <Card.Header>Welcome</Card.Header>
            <Card.Body>Welcome</Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>Alerts</Card.Header>
            <Card.Body>System Alerts</Card.Body>
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
            <Card.Body>Other Alerts</Card.Body>
            <ListGroup className="list-group-flush">
              {alertsData &&
                alertsData.map(alert => {
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
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
