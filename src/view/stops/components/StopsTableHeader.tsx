import * as React from 'react';
import { Route, StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import { map } from 'lodash';
import RouteIndicator from '../../../component/route/RouteIndicator';
import ReloadButton, { Event } from '../../../component/ReloadButton';
import { LoadArrivalData } from '../../../store/action/stopActions';

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
    static getStopRoutes(stopLocation: StopLocation) {
        return map(stopLocation.route, (route: Route) => {
            return (
                <RouteIndicator
                    key={route.route}
                    routeId={route.route}
                    className="header-router-indicator"
                />
            );
        });
    }
    constructor(props: Props) {
        super(props);

        this.state = {
            interval: 30
        };
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
    componentDidMount() {
        const { showArrivals } = this.props;

        if (showArrivals) {
            this.setNewInterval();
        }
    }
    clearIntervalListener() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval as number);
        }
    }
    componentWillUnmount() {
        const { showArrivals } = this.props;

        if (showArrivals) {
            this.clearIntervalListener();
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
                <h2>
                    {StopsTableHeader.getStopRoutes(stopLocation)}
                    {stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}
                </h2>
                <div className="stops-reload-button">
                    <span>{this.state.interval}</span>
                    { showArrivals &&
                        <ReloadButton
                            onClick={(e: Event) => this.onReloadClick(e)}
                            disabled={loading}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default StopsTableHeader;