import React from "react";
import { Card } from "react-bootstrap";
import { StopLocation } from "../../../../api/trimet/interfaces/types";

interface StopInfoParams {
  stopLocation: StopLocation;
}

function StopInfo({ stopLocation }: StopInfoParams) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{stopLocation.desc}</Card.Title>
        <Card.Text>
          <small className="text-muted">StopID: {stopLocation.id}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StopInfo;
