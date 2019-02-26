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

    this.hide = this.hide.bind(this);
    this.showMore = this.showMore.bind(this);
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
        {arrivals.length > 5 && this.showLoadMoreControl(showMore)}
      </div>
    );
  }

  private showLoadMoreControl(showMore: boolean) {
    return (
      <div className="arrivals-load-more-control">
        {showMore && <button onClick={this.hide}>Hide</button>}
        {!showMore && <button onClick={this.showMore}>Show More</button>}
      </div>
    );
  }

  private showMore() {
    this.setState({
      showMore: true
    });
  }

  private hide() {
    this.setState({
      showMore: false
    });
  }
}
