import * as React from 'react';
import { Arrival } from '../../api/trimet/types';
import ArrivalsTable from './components/ArrivalsTable';
import * as FontAwesome from 'react-fontawesome';
import './Arrivals.css';
import { LoadArrivalData } from '../../store/action/stopActions';

interface Props {
    loading: boolean;
    locationId: number;
    arrivals: Arrival[];
    loadArrivalData: LoadArrivalData;
    showArrivals: boolean;
}

class ArrivalsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadArrivalData, locationId, showArrivals } = this.props;

        if (showArrivals) {
            loadArrivalData(locationId);
        }
    }
    render() {
        const { arrivals, loading = true, showArrivals = true } = this.props;
        
        return (
            <div>
                {loading && showArrivals &&
                    <div className="spin-icon-wrapper">
                        <FontAwesome
                            className="arrival-load-spinner"
                            name="refresh"
                            spin={true}
                            size="3x"
                        />
                    </div>
                }
                {!loading && showArrivals && !arrivals &&
                    <p className="no-arrivals">No arrivals available.</p>
                }
                {!loading && showArrivals && arrivals &&
                    <ArrivalsTable arrivals={arrivals} />  
                }
            </div>
        );
    }
}

export default ArrivalsComponent;