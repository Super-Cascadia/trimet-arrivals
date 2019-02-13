import { combineReducers } from 'redux';
import stopsReducer, { StopsReducerState } from './stopsReducer';
import arrivalsReducer, { ArrivalsReducerState } from './arrivalsReducer';

export interface RootState {
    stopsReducer: StopsReducerState;
    arrivalsReducer: ArrivalsReducerState;
}

const app = combineReducers<RootState>({
    stopsReducer,
    arrivalsReducer
} as any);

export default app;