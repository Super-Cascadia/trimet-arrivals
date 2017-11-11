import * as React from 'react';
import './Stops.css';
import StopsTableHeader from './components/StopsTableHeader';
import ArrivalsContainer from '../arrivals/ArrivalsContainer';
import { StopLocation } from '../../api/trimet/types';
import { LoadArrivalData } from '../../store/action/stopActions';

interface Props {
    stopLocation: StopLocation;
    loadArrivalData: LoadArrivalData;
    locationId: number;
    loading: boolean;
    showArrivals: boolean;
}

class StopComponent extends React.Component<Props> {
    refreshInterval: {};

    loadAndSetInterval(locationId: number, load: LoadArrivalData) {
        load(locationId);

        const interval = 30000;

        this.refreshInterval = setInterval(load(locationId), interval);
    }
    loadArrivals(locationId: number) {
        const { loadArrivalData } = this.props;

        if (this.refreshInterval) {
            clearInterval(this.refreshInterval as number);
            this.loadAndSetInterval(locationId, loadArrivalData);
        } else {
            this.loadAndSetInterval(locationId, loadArrivalData);
        }
    }
    render() {
        const { stopLocation, locationId, loading, showArrivals } = this.props;

        return (
            <div className="stops">
                <StopsTableHeader
                    stopLocation={stopLocation}
                    loadArrivalData={(locId: number) => this.loadArrivals(locId)}
                    loading={loading}
                    showArrivals={showArrivals}
                />
                <ArrivalsContainer
                    locationId={locationId}
                    showArrivals={showArrivals}
                    loadArrivalData={(locId: number) => this.loadArrivals(locId)}
                />
            </div>

        );
    }
}

export default StopComponent;