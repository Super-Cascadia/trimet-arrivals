import * as React from 'react';
import { Arrival } from '../../api/trimet/types';
import ArrivalsTable from './components/ArrivalsTable';

export interface Props {
    loading: Boolean;
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
        const { arrivals, loading } = this.props;
        
        return (
            <section>
                {loading &&
                    <p>Loading...</p>
                }
                {!loading && !arrivals &&
                    <p>No arrivals available.</p>
                }
                {!loading && arrivals &&
                    <ArrivalsTable arrivals={arrivals} />  
                }
            </section>
        );
    }
}

export default ArrivalsComponent;