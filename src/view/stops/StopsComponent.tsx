import React from "react";
import { LoadStopData } from "../../store/action/stopActions";
import { StopLocationsDictionary } from "../../store/reducers/stopsReducer";
import Stops from "./components/Stops";
import "./Stops.css";

interface Props {
  loadStopData: LoadStopData;
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  timeOfLastLoad: string;
}

class StopsComponent extends React.Component<Props> {
  public componentDidMount() {
    const { loadStopData } = this.props;

    if (loadStopData) {
      loadStopData(750);
    }
  }
  public render() {
    const { loading, stopLocations, timeOfLastLoad } = this.props;

    return (
      <div>
        {loading && <div className="loading-message">Loading...</div>}
        {!loading && stopLocations && (
          <div className="nearby-stops">
            <h1>
              Nearby Stops | <i>{timeOfLastLoad}</i>
            </h1>
            <Stops stopLocations={stopLocations} showArrivals={true} />
          </div>
        )}
      </div>
    );
  }
}

export default StopsComponent;
