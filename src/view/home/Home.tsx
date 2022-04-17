import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getSytemAlerts } from "../../api/trimet/alerts";
import AllAlertsCard from "./AllAlertsCard";
import { InfoCard } from "./InfoCard";
import { SystemAlertsCard } from "./SystemAlertsCard";

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
