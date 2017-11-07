import * as React from 'react';
import './RouteIndicator.css';

export interface Props {
    route: number;
}

class RouteIndicator extends React.PureComponent<Props> {
    render() {
        const { route } = this.props;

        return (
            <div className="route-indicator">{route}</div>
        );
    }
}

export default RouteIndicator;