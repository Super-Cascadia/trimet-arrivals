import React from 'react';
import { Route, StopLocation } from '../../../api/trimet/types';
import { map } from 'lodash';
import RouteIndicator from '../../../component/route/RouteIndicator';

function getStopRoutes(stopLocation: StopLocation) {
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

export default function StopInfo({ stopLocation } : { stopLocation: StopLocation}) {
    return (
        <h2>
            {getStopRoutes(stopLocation)}
            {stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}
        </h2>
    );
}