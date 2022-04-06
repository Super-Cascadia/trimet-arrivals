import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Table
} from "react-bootstrap";
import { getSytemAlerts } from "../../api/trimet/alerts";

function getStopClosureTable(locations) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Stop ID</th>
          <th>Desc</th>
          <th>Direction</th>
        </tr>
      </thead>
      <tbody>
        {locations.map(loc => {
          return (
            <tr key={loc.id}>
              <td>{loc.id}</td>
              <td>{loc.desc}</td>
              <td>{loc.dir}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function getRouteAlertTable(routes) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Route ID</th>
          <th>Desc</th>
        </tr>
      </thead>
      <tbody>
        {routes.map(location => {
          return (
            <tr key={location.id}>
              <td>{location.id}</td>
              <td>{location.desc}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function getImpactedRoutes(routes) {
  return routes.map(route => {
    return (
      <Badge bg="primary" key={route.id}>
        {route.desc}
      </Badge>
    );
  });
}

function getInfoCard() {
  return (
    <Card>
      <Card.Header>Welcome to Trimet Arrivals</Card.Header>
      <Card.Body>
        Trimet Arrivals is a web service that can be used to get useful
        information about the state of the Trimet Transit Service.
      </Card.Body>
    </Card>
  );
}

function getSystemAlertsCard(systemAlertsData) {
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

function getAllAlertsCard(alertsData) {
  return (
    <Card>
      <Card.Header>Route & Stop Alerts</Card.Header>

      <Accordion defaultActiveKey="0">
        {alertsData &&
          alertsData.map(alert => {
            return (
              <Accordion.Item eventKey={alert.id} key={alert.id}>
                <Accordion.Header>
                  {alert.location && <Badge bg="warning">Stop Closure</Badge>}
                  {alert.route && getImpactedRoutes(alert.route)}
                  {alert.id} - {alert.header_text} -{" "}
                  {moment(alert.begin).format("MM-DD-YY")} to{" "}
                  {moment(alert.end).format("MM-DD-YY")}
                </Accordion.Header>
                <Accordion.Body>
                  {alert.desc}
                  <br />
                  {alert.location && getStopClosureTable(alert.location)}
                  {alert.route && getRouteAlertTable(alert.route)}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
    </Card>
  );
}

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

      const nonSystemAlertsSorted = nonSystemAlerts.sort((a, b) => {
        return b.begin - a.begin;
      });

      setAlertsData(nonSystemAlertsSorted);
      setSystemAlertsData(systemAlerts);

      // console.log(result);
    });
  }, []);

  return (
    <Container>
      <br />
      <Row>
        <Col>{getInfoCard()}</Col>
        <Col>
          {getSystemAlertsCard(systemAlertsData)}
          <br />
          {getAllAlertsCard(alertsData)}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
