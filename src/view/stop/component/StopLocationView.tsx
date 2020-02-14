import { map } from "lodash";
import moment from "moment";
import React from "react";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import {
  TrimetArrivalData,
  TrimetLocation
} from "../../../store/reducers/data/arrivalsDataReducer";
import ArrivalRow from "../../arrivals/components/ArrivalRow";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import ArrivalRowContainer from "../container/ArrivalRowContainer";

interface Props {
  loadArrivalData: (locationId: number) => void;
  locationId: number;
  arrivals: TrimetArrivalData;
}

function getArrivalRoute(routes: TrimetRoute[], routeId: number) {
  return routes.find((route: TrimetRoute) => route.route === routeId);
}

export default class StopLocationView extends React.Component<Props> {
  private static getLocationInfoPane(
    location: TrimetLocation,
    arrivals: TrimetArrivalData
  ) {
    return (
      <CollapsiblePane className={undefined} title={"Info"} open={true}>
        <ul>
          <li>Direction: {location.dir}</li>
          <li>Queried: {arrivals.queryTime}</li>
          <li>
            Lat / Lng: {location.lat} / {location.lng}
          </li>
          <li>Passenger Code: {location.passengerCode}</li>
        </ul>
      </CollapsiblePane>
    );
  }

  private static getArrivals(arrivals: Arrival[]) {
    return map(arrivals, arrival => {
      return <ArrivalRowContainer arrival={arrival} />;
    });
  }

  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    const arrivals = this.props.arrivals;

    if (!arrivals) {
      return "Loading Arrival Data...";
    }

    const location = arrivals.location[0];

    return (
      <div>
        <header>
          <h2>
            {location.id} - {location.desc}
          </h2>
        </header>
        {StopLocationView.getLocationInfoPane(location, arrivals)}
        <CollapsiblePane className={undefined} title={"Map"} open={true}>
          <p>Map goes here</p>
        </CollapsiblePane>
        <CollapsiblePane className={undefined} title={"Arrivals"} open={true}>
          <div className="arrivals-wrapper">
            <table className="arrivals-table">
              <tbody>{StopLocationView.getArrivals(arrivals.arrival)}</tbody>
            </table>
          </div>
        </CollapsiblePane>
      </div>
    );
  }
}
