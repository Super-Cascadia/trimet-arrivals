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

interface StopInfoParams {
  shortSign: string;
  stopLocation: StopLocation;
}

function RouteStopInfo({ shortSign, stopLocation }: StopInfoParams) {
  const renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      Bookmark this route
    </Tooltip>
  );

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
          <Button variant="primary">GO</Button>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
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
