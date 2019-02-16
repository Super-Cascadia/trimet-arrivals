import React from 'react';
import { Arrival } from '../../api/trimet/types';
import ArrivalsTable from './components/ArrivalsTable';
import './Arrivals.css';
import { LoadArrivalData } from '../../store/action/stopActions';
import { Moment } from 'moment';

interface Props {
    loading: boolean;
    locationId: number;
    arrivals: Arrival[];
    loadArrivalData: LoadArrivalData;
    showArrivals: boolean;
    now: Moment
}

class ArrivalsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadArrivalData, locationId, showArrivals } = this.props;

        if (showArrivals) {
            loadArrivalData(locationId);
        }
    }
    render() {
        const { arrivals, loading = true, showArrivals = true, now } = this.props;
        
        return (
            <div className="arrivals-wrapper">
                {!loading && showArrivals && !arrivals &&
                    <p className="no-arrivals">No arrivals available.</p>
                }
                {showArrivals && arrivals &&
                    <ArrivalsTable arrivals={arrivals} loading={loading} now={now} />
                }
            </div>
        );
    }
}

export default ArrivalsComponent;