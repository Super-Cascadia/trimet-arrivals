import React from 'react';
import { StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import { LoadArrivalData } from '../../../store/action/stopActions';
import StopInfo from './StopInfo';
import ReloadButtonCoordinator from './ReloadButtonCoordinator';

interface Props {
    stopLocation: StopLocation;
    loadArrivalData: LoadArrivalData;
    loading: boolean;
    showArrivals: boolean;
}

export default class StopsTableHeader extends React.Component<Props> {
    render() {
        const { stopLocation, loading, showArrivals, loadArrivalData } = this.props;

        if (!stopLocation) {
            return null;
        }

        return (
            <div className="stops-header">
                <StopInfo stopLocation={stopLocation}/>
                <ReloadButtonCoordinator
                    stopLocation={stopLocation}
                    loadArrivalData={loadArrivalData}
                    loading={loading}
                    showArrivals={showArrivals}
                />
            </div>
        );
    }
}