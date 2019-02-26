import { Moment } from "moment";
import React from "react";
import { Arrival, Route, StopLocation } from "../../../api/trimet/types";
import "./Arrivals.css";
import ArrivalsTable from "./ArrivalsTable";

interface Props {
  loading: boolean;
  arrivals: Arrival[];
  now: Moment;
  stopLocation: StopLocation;
  onRouteIndicatorClick: (route: Route) => void;
}

interface State {
  showMore: boolean;
}

export default class ArrivalsTableLoadMore extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false
    };

    this.toggleShowMore = this.toggleShowMore.bind(this);
  }
  public render() {
    const {
      arrivals,
      loading = true,
      now,
      onRouteIndicatorClick,
      stopLocation
    } = this.props;
    const { showMore } = this.state;

    return (
      <div className="arrivals-wrapper">
        <ArrivalsTable
          arrivals={arrivals}
          loading={loading}
          now={now}
          onRouteIndicatorClick={onRouteIndicatorClick}
          stopLocation={stopLocation}
          showMore={showMore}
        />
        {arrivals.length > 5 &&
          this.showLoadMoreControl(showMore, arrivals.length)}
      </div>
    );
  }

  private showLoadMoreControl(showMore: boolean, arrivalCount: number) {
    const additionalArrivals = arrivalCount - 5;

    return (
      <div className="arrivals-load-more-control">
        <div className="load-more-flex-container">
          {showMore && (
            <button onClick={this.toggleShowMore}>Only show 5 arrivals</button>
          )}
          {!showMore && (
            <button onClick={this.toggleShowMore}>
              Show {additionalArrivals} more arrivals
            </button>
          )}
        </div>
      </div>
    );
  }

  private toggleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    });
  }
}
