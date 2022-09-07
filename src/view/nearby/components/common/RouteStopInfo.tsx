import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  OverlayTrigger,
  Stack,
  Tooltip
} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../../../api/trimet/interfaces/types";

const BookmarkTooltip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Bookmark this route
  </Tooltip>
);

const GoToolTip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Go from this stop
  </Tooltip>
);

interface StopInfoParams {
  shortSign: string;
  stopLocation: StopLocation;
}

function RouteStopInfo({ shortSign, stopLocation }: StopInfoParams) {
  return (
    <Stack direction="horizontal" gap={3}>
      <div className="me-auto">
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesome name="arrow-circle-right" />
              {shortSign}
            </Card.Title>
            <Card.Text>
              <small className="text-muted">
                Stop: {stopLocation.desc} ({stopLocation.id})
              </small>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div>
        <ButtonGroup vertical={true}>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={GoToolTip}
          >
            <Button variant="primary">GO</Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={BookmarkTooltip}
          >
            <Button variant="outline-secondary">
              <FontAwesome name="bookmark" />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </div>
    </Stack>
  );
}

export default RouteStopInfo;
