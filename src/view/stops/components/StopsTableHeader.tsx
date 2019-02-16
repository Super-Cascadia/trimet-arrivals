import React from 'react';
import { StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import ReloadButton, { Event } from '../../../component/ReloadButton';
import { LoadArrivalData } from '../../../store/action/stopActions';
import StopInfo from './StopInfo';

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

class StopsTableHeader extends React.Component<Props, State> {
    refreshInterval: {};

    constructor(props: Props) {
        super(props);

        this.state = {
            interval: 30
        };
    }

    componentDidMount() {
        const { showArrivals } = this.props;

        if (showArrivals) {
            this.setNewInterval();
        }
    }

    componentWillUnmount() {
        const { showArrivals } = this.props;

        if (showArrivals) {
            this.clearIntervalListener();
        }
    }

    onInterval() {
        const { interval } = this.state;

        if (interval === 0) {
            this.loadData();
        } else {
            this.setState({ interval: interval - 1 });
        }
    }

    setNewInterval() {
        this.refreshInterval = setInterval(() => this.onInterval(), ONE_SECOND);
    }

    clearIntervalListener() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval as number);
        }
    }

    resetLoadCounter() {
        this.clearIntervalListener();
        this.setState({ interval: THIRTY });
    }

    loadData() {
        const { loadArrivalData, stopLocation } = this.props;

        this.resetLoadCounter();
        this.setNewInterval();
        loadArrivalData(stopLocation.locid);
    }

    onReloadClick(e: Event): void {
        e.preventDefault();
        this.loadData();
    }

    render() {
        const { stopLocation, loading, showArrivals = true } = this.props;

        if (!stopLocation) {
            return null;
        }

        return (
            <div className="stops-header">
                <StopInfo stopLocation={stopLocation}/>
                <div className="stops-reload-button">
                    { showArrivals &&
                        <ReloadButton
                            onClick={(e: Event) => this.onReloadClick(e)}
                            disabled={loading}
                        >
                            <span className="count-down-label">{this.state.interval}</span>
                        </ReloadButton>
                    }
                </div>
            </div>
        );
    }
}

export default StopsTableHeader;