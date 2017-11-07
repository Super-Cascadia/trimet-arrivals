import * as React from 'react';
import * as cx from 'classnames';
import './RouteIndicator.css';

export interface Props {
    route: number;
}

const RED_LINE_NUMBER = 90;
const BLUE_LINE_NUMBER = 100;

const ROUTE_DISPLAY = {
    90: 'Red',
    100: 'Blue'
};

function getRouteDisplay(route: number) {
    const display = ROUTE_DISPLAY[route];

    if (!display) {
        return route;
    }

    return display;
}

function getRouteIndicatorClassName(route: number) {
    const isRedLine = route === RED_LINE_NUMBER;
    const isBlueLine = route === BLUE_LINE_NUMBER;

    return cx('route-indicator', {
        'route-indicator-green': route === 123,
        'route-indicator-yellow': route === 123,
        'route-indicator-red': isRedLine,
        'route-indicator-blue': isBlueLine,
        'route-indicator-orange': route === 123,
    });
}

class RouteIndicator extends React.PureComponent<Props> {
    render() {
        const { route } = this.props;

        const classNames = getRouteIndicatorClassName(route);
        const routeDisplay = getRouteDisplay(route);

        return (
            <div className={classNames}>{routeDisplay}</div>
        );
    }
}

export default RouteIndicator;