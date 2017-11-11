import * as React from 'react';
import { Arrival } from '../../api/trimet/types';
import ArrivalsTable from './components/ArrivalsTable';
import * as FontAwesome from 'react-fontawesome';
import './Arrivals.css';

export interface Props {
    loading: boolean;
    locationId: number;
    arrivals: Arrival[];
    loadArrivalData: (locationId: number) => void;
}

class ArrivalsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadArrivalData, locationId } = this.props;

        loadArrivalData(locationId);
    }
    render() {
        const { arrivals, loading = true } = this.props;
        
        return (
            <div>
                {loading &&
                    <div className="spin-icon-wrapper">
                        <FontAwesome
                            className="arrival-load-spinner"
                            name="refresh"
                            spin={true}
                            size="3x"
                        />
                    </div>
                }
                {!loading && !arrivals &&
                    <p className="no-arrivals">No arrivals available.</p>
                }
                {!loading && arrivals &&
                    <ArrivalsTable arrivals={arrivals} />  
                }
            </div>
        );
    }
}

export default ArrivalsComponent;