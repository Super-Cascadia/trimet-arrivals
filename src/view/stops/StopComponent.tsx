import * as React from 'react';
import './Stops.css';
import StopsTableHeader from './components/StopsTableHeader';
import ArrivalsContainer from '../arrivals/ArrivalsContainer';
import { StopLocation } from '../../api/trimet/types';

export type LoadArrivalData = (locationId: number) => void;

interface Props {
    stopLocation: StopLocation;
    loadArrivalData: LoadArrivalData;
    locationId: number;
}

class StopComponent extends React.Component<Props> {
    render() {
        const { stopLocation, loadArrivalData, locationId } = this.props;

        return (
            <div className="stops">
                <StopsTableHeader
                    stopLocation={stopLocation}
                    loadArrivalData={loadArrivalData}
                />
                <ArrivalsContainer locationId={locationId} />
            </div>

        );
    }
}

export default StopComponent;