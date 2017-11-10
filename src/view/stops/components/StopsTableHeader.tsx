import * as React from 'react';
import { StopLocation } from '../../../api/trimet/types';
import '../Stops.css';

export interface Props {
    stopLocation: StopLocation;
}

class StopsTableHeader extends React.Component<Props> {
    render() {
        const { stopLocation } = this.props;

        if (!stopLocation) {
            return null;
        }

        return (
            <div className="stops-header">
                <h2>{stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}</h2>
            </div>
        );
    }
}

export default StopsTableHeader;