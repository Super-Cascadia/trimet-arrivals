import * as React from 'react';
import { LocationArrivals } from '../../store/reducers/arrivalsReducer';
import { map } from 'lodash';
import { Arrival } from '../../api/trimet/types';

export interface Props {
    loading: Boolean;
    locationId: number;
    arrivals: LocationArrivals;
}

class ArrivalsComponent extends React.Component<Props> {
    getRow(arrival: Arrival) {
        return (
            <tr>
                <td>{arrival.shortSign}</td>
                <td>{arrival.feet}</td>
                <td>{arrival.scheduled}</td>    
                <td>{arrival.estimated}</td>                    
            </tr>
        );
    }

    getRows(arrivals: LocationArrivals) {
        return map(arrivals, (arrival: Arrival) => {
            return this.getRow(arrival);
        });
    }

    getArrivalsTable(arrivals: LocationArrivals) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name:</th>
                        <th>Distance:</th>
                        <th>Scheduled:</th>
                        <th>Estimated:</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getRows(arrivals)}
                </tbody>
            </table>
        );
    }
    
    render() {
        const { arrivals } = this.props;

        if (!arrivals) {
            return null;
        }
        
        return (
            <section>
                <h2>Arrivals</h2>
                {this.getArrivalsTable(arrivals)}
            </section>
            
        );
    }
}

export default ArrivalsComponent;