import { combineReducers } from 'redux';
import stopsReducer, { StopLocationState } from './stopsReducer';

export interface StopsReducerState {
    loading: Boolean;
    stopLocations: StopLocationState;
}

export interface RootState {
    stopsReducer: StopsReducerState;
}

const app = combineReducers<RootState>({
    stopsReducer
});

export default app;