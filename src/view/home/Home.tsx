import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getSytemAlerts } from "../../api/trimet/alerts";
import { AlertsData } from "../../api/trimet/interfaces/alertsData";
import AllAlertsCard from "./AllAlertsCard";
import { InfoCard } from "./InfoCard";
import { SystemAlertsCard } from "./SystemAlertsCard";

function processAlertsData(
  result: AlertsData,
  setAlertsData: (value: unknown) => void,
  setSystemAlertsData: (value: unknown) => void
) {
  const alerts = result.alert;

  const systemAlerts = alerts.filter(alert => alert.system_wide_flag === true);
  const nonSystemAlerts = alerts.filter(
    alert => alert.system_wide_flag !== true
  );

  const nonSystemAlertsSorted = nonSystemAlerts.sort((a, b) => {
    return b.begin - a.begin;
  });

  setAlertsData(nonSystemAlertsSorted);
  setSystemAlertsData(systemAlerts);
}

function Home() {
  const [alertsData, setAlertsData] = useState(undefined);
  const [systemAlertsData, setSystemAlertsData] = useState(undefined);

  useEffect(() => {
    getSytemAlerts().then(result =>
      processAlertsData(result, setAlertsData, setSystemAlertsData)
    );
  }, []);

  return (
    <Container>
      <br />
      <Row>
        <Col md={6}>
          <InfoCard />
        </Col>
        <Col md={6}>
          <SystemAlertsCard systemAlertsData={systemAlertsData} />
          <br />
          <AllAlertsCard alertsData={alertsData} />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
