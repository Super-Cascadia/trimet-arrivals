import arrivalsReducer from './arrivalsReducer';
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from '../constants';
import { ArrivalData, Arrival } from '../../api/trimet/types';

describe('arrivalsReducer', () => {
    describe('default behavior', () => {
        it('returns the present state', () => {
            const initialState = {
                arrivals: {},
                loading: {}
            };

            const action = {
                type: 'FOO'
            };

            const result = arrivalsReducer(initialState, action);

            expect(result.arrivals).toEqual({});
            expect(result.loading).toEqual({});
        });
    });

    describe('LOAD_ARRIVALS', function () {
        const initialState = {
            arrivals: {},
            loading: {}
        };

        const action = {
            type: LOAD_ARRIVALS,
            payload: {
                arrivalData: {
                    arrival: {}
                } as ArrivalData,
                locationId: 123
            }
        };

        const result = arrivalsReducer(initialState, action);

        it('updates loading state ', function () {
            expect(result.loading).toEqual({ 123: true });
        });

        it('loading remains un populated', function () {
            expect(result.arrivals).toEqual({});
        });

    });

    describe('LOAD_ARRIVALS_COMPLETE', function () {
        const initialState = {
            arrivals: {},
            loading: {}
        };

        const action = {
            type: LOAD_ARRIVALS_COMPLETE,
            payload: {
                arrivalData: {
                    arrival: [
                        {
                            locid: 123
                        },
                        {
                            locid: 456
                        }
                    ]
                } as ArrivalData,
                locationId: 123
            }
        };

        const result = arrivalsReducer(initialState, action);

        it('updates loading state ', function () {
            expect(result.loading).toEqual({ 123: false });
        });

        it('loading remains un populated', function () {
            expect(result.arrivals).toEqual({
                123: [
                    { locid: 123 }
                ],
                456: [
                    { locid: 456 }
                ]
            });
        });
    });
});
