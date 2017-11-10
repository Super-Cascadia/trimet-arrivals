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
    loading: boolean;
}

class StopComponent extends React.Component<Props> {
    render() {
        const { stopLocation, loadArrivalData, locationId, loading } = this.props;

        return (
            <div className="stops">
                <StopsTableHeader
                    stopLocation={stopLocation}
                    loadArrivalData={loadArrivalData}
                    loading={loading}
                />
                <ArrivalsContainer locationId={locationId} />
            </div>

        );
    }
}

export default StopComponent;