import * as React from 'react';
import { Route, StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import { map } from 'lodash';
import RouteIndicator from '../../../component/route/RouteIndicator';
import ReloadButton from '../../../component/ReloadButton';
import { LoadArrivalData } from './StopsTable';

interface Props {
    stopLocation: StopLocation;
    loadArrivalData: LoadArrivalData;
}

class StopsTableHeader extends React.Component<Props> {
    static getStopRoutes(stopLocation: StopLocation) {
        return map(stopLocation.route, (route: Route) => {
            return (
                <RouteIndicator routeId={route.route} className="header-router-indicator"/>
            );
        });
    }
    loadArrivalData(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        this.props.loadArrivalData(this.props.stopLocation.locid);
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
                <div className="stops-reload-button">
                    <ReloadButton onClick={(e) => this.loadArrivalData(e)}/>
                </div>
            </div>
        );
    }
}

export default StopsTableHeader;