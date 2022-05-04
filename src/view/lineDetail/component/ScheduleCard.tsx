import React from "react";
import { Card } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import FrequentServiceIndicator from "../../../component/route/FrequentServiceIndicator";
import { LineScheduleInfo } from "../../../data/trimet/schedules/maxLightRail";

interface ScheduleCardParams {
  routeSchedule: LineScheduleInfo;
  route: TrimetRoute;
}

export function ScheduleCard({ routeSchedule, route }: ScheduleCardParams) {
  return (
    <Card>
      <Card.Header as="h5">Schedule</Card.Header>
      <Card.Body>
        <Card.Text>
          <>
            {routeSchedule && routeSchedule.frequentService && (
              <FrequentServiceIndicator
                frequentService={routeSchedule.frequentService}
              />
            )}
            <strong>Hours of Operation:</strong> 5:00 AM - 12:00 PM
            <br />
            <strong>Connections:</strong>
            <br />
            <strong>Areas served:</strong>
          </>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
