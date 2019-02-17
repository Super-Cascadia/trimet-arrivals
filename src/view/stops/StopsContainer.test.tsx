import { mount, shallow } from 'enzyme';
import { ProviderMock } from '../../test/util';
import StopsContainer from './StopsContainer';
import React from 'react';
import { Arrival, StopLocation } from '../../api/trimet/types';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

function mockStore() {
    const arrivalsInitialState = {
        arrivals: {},
        loading: {}
    };

    const arrivalsReducer = (state = arrivalsInitialState) => {
        return state;
    };

    const stopsInitialState = {
        loading: false,
        timeOfLastLoad: ''
    };

    const stopsReducer = (state = stopsInitialState) => {
        return state;
    };

    const baseState = {
        arrivalsReducer: {
            loading: {
                123: false
            },
            arrivals: {
                123: {} as Arrival
            }
        },
        stopsReducer: {
            loading: false,
            stopLocations: {
                123: {
                    locid: 123
                } as StopLocation
            },
            timeOfLastLoad: "some time"
        }
    };

    return createStore(combineReducers({ arrivalsReducer, stopsReducer }), baseState, applyMiddleware(thunk));
}

describe('StopsContainer', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ProviderMock>
                    <StopsContainer />
                </ProviderMock>
            )).not.toThrow();
        });
    });

    describe('when provided a valid stopsReducer', function () {
        const subject = mount(
            <ProviderMock store={mockStore()}>
                <StopsContainer />
            </ProviderMock>
        );

        it('hands off props to the StopComponent', function () {
            const stopComponent = subject.find('StopsComponent');

            expect(stopComponent).toExist()

            expect(stopComponent.props().stopLocations).toEqual({ 123: { locid: 123 }});
            expect(stopComponent.props().timeOfLastLoad).toEqual("some time");
            expect(stopComponent.props().loading).toBe(false);
        });
    });
});
