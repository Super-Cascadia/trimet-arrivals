import React from "react";
import { Card } from "react-bootstrap";

interface InfoCardParams {
  id: string;
}

export function InfoCard({ id }: InfoCardParams) {
  return (
    <Card>
      {/*<Card.Header>Stop Info</Card.Header>*/}
      <Card.Body>
        <Card.Title as="h6">{id} schedule:</Card.Title>
        <Card.Text>5:00 to 23:30</Card.Text>
        <hr />
        <Card.Title as="h6">Stop also serves:</Card.Title>
        <Card.Text>56, 54</Card.Text>
      </Card.Body>
    </Card>
  );
}
