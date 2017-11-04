import * as React from 'react';
import { StopLocationState } from '../../store/reducers/stopsReducer';

export interface Props {
    loadStopData: () => void;
    loading: Boolean;
    stopLocations: StopLocationState;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData();        
    }
    render() {
        return (
            <div>
                foo
            </div>
        );
    }
}

export default StopsComponent;