import * as React from 'react';
import { LocationArrivals } from '../../store/reducers/arrivalsReducer';
import ArrivalsTable from './components/ArrivalsTable';

export interface Props {
    loading: Boolean;
    locationId: number;
    arrivals: LocationArrivals;
}

class ArrivalsComponent extends React.Component<Props> {    
    render() {
        const { arrivals, loading } = this.props;
        
        return (
            <section>
                <h2>Arrivals</h2>
                {loading &&
                    <p>Loading...</p>
                }
                {!loading &&
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