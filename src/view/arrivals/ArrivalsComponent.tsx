import * as React from 'react';
import { Arrival } from '../../api/trimet/types';
import ArrivalsTable from './components/ArrivalsTable';

export interface Props {
    loading: Boolean;
    locationId: number;
    arrivals: Arrival[];
}

class ArrivalsComponent extends React.Component<Props> {    
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