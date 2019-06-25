import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import ReloadButton from "../../../component/buttons/ReloadButton";
import { LoadArrivalData } from "../../../store/action/stopActions";
import "../Stops.scss";

type Event = React.MouseEvent<HTMLElement>;

interface Props {
  stopLocation: StopLocation;
  loadArrivalData: LoadArrivalData;
  loading: boolean;
  showArrivals: boolean;
}

interface State {
  interval: number;
}

const ONE_SECOND = 1000;
const THIRTY = 30;

export default class ReloadIntervalCoordinator extends React.Component<
  Props,
  State
> {
  public refreshInterval: {};
  private onClick: (e: Event) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      interval: 30
    };

    this.onClick = (e: Event) => this.onReloadClick(e);
  }

  public componentDidMount() {
    const { showArrivals } = this.props;

    if (showArrivals) {
      this.setNewInterval();
    }
  }

  public componentWillUnmount() {
    const { showArrivals } = this.props;

    if (showArrivals) {
      this.clearIntervalListener();
    }
  }

  public onInterval() {
    const { interval } = this.state;

    if (interval === 0) {
      this.loadData();
    } else {
      this.setState({ interval: interval - 1 });
    }
  }

  public setNewInterval() {
    this.refreshInterval = setInterval(() => this.onInterval(), ONE_SECOND);
  }

  public clearIntervalListener() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval as number);
    }
  }

  public resetLoadCounter() {
    this.clearIntervalListener();
    this.setState({ interval: THIRTY });
  }

  public loadData() {
    const { loadArrivalData, stopLocation } = this.props;

    this.resetLoadCounter();
    this.setNewInterval();
    loadArrivalData(stopLocation.locid);
  }

  public onReloadClick(e: Event): void {
    e.preventDefault();
    this.loadData();
  }

  public render() {
    const { stopLocation, loading, showArrivals = true } = this.props;

    if (!stopLocation) {
      return null;
    }

    return (
      <div className="stops-reload-button">
        {showArrivals && (
          <ReloadButton onClick={this.onClick} disabled={loading}>
            <span className="count-down-label">{this.state.interval}</span>
          </ReloadButton>
        )}
      </div>
    );
  }
}
