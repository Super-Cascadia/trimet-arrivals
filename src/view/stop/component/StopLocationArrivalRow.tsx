import moment from "moment";
import React from "react";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import ArrivalRow from "../../arrivals/components/ArrivalRow";
import Loading from "../../loading/Loading";

interface Props {
  locationId?: number;
  arrival: Arrival;
  route: TrimetRoute;
}

export default class StopLocationView extends React.Component<Props> {
  public render() {
    const { arrival, route } = this.props;

    if (!arrival) {
      return <Loading />;
    }

    return (
      <ArrivalRow
        scheduled={arrival.scheduled}
        estimated={arrival.estimated}
        feet={arrival.feet}
        routeId={arrival.route}
        shortSign={arrival.shortSign}
        now={moment()}
        onRouteIndicatorClick={undefined}
        route={route}
      />
    );
  }
}
