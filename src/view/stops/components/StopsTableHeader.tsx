import * as React from 'react';
import { Route, StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import { map } from 'lodash';
import RouteIndicator from '../../../component/route/RouteIndicator';

export interface Props {
    stopLocation: StopLocation;
}

class StopsTableHeader extends React.Component<Props> {
    static getStopRoutes(stopLocation: StopLocation) {
        return map(stopLocation.route, (route: Route) => {
            return (
                <RouteIndicator routeId={route.route} className="header-router-indicator"/>
            );
        });
    }
    render() {
        const { stopLocation } = this.props;

        if (!stopLocation) {
            return null;
        }

        return (
            <div className="stops-header">
                <h2>
                    {StopsTableHeader.getStopRoutes(stopLocation)}
                    {stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}
                </h2>
            </div>
        );
    }
}

export default StopsTableHeader;