import * as React from 'react';
import { Route, StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import { map } from 'lodash';
import RouteIndicator from '../../../component/route/RouteIndicator';
import ReloadButton, { Event } from '../../../component/ReloadButton';
import { LoadArrivalData } from './StopsTable';

interface Props {
    stopLocation: StopLocation;
    loadArrivalData: LoadArrivalData;
    loading: boolean;
}

class StopsTableHeader extends React.Component<Props> {
    static getStopRoutes(stopLocation: StopLocation) {
        return map(stopLocation.route, (route: Route) => {
            return (
                <RouteIndicator
                    routeId={route.route}
                    className="header-router-indicator"
                />
            );
        });
    }
    loadArrivalData(e: Event) {
        e.preventDefault();
        const { loadArrivalData, stopLocation } = this.props;
        loadArrivalData(stopLocation.locid);
    }
    render() {
        const { stopLocation, loading } = this.props;

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
                    <ReloadButton
                        onClick={(e: Event) => this.loadArrivalData(e)}
                        disabled={loading}
                    />
                </div>
            </div>
        );
    }
}

export default StopsTableHeader;