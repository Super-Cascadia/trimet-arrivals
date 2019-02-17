import { mount, shallow } from 'enzyme';
import React from 'react';
import ArrivalsContainer from './ArrivalsContainer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Arrival } from '../../api/trimet/types';
import { ProviderMock } from '../../test/util';

function mockStore() {
    const initialState = {
        loading: {},
        timeOfLastLoad: {}
    };

    const arrivalsReducer = (state = initialState) => {
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
        }
    };

    return createStore(combineReducers({arrivalsReducer}), baseState, applyMiddleware(thunk));
}

describe('ArrivalsContainer', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ProviderMock>
                    <ArrivalsContainer
                        locationId={undefined}
                        showArrivals={undefined}
                        loadArrivalData={undefined}
                    />
                </ProviderMock>
            )).not.toThrow();
        });
    });

    describe('when provided a valid arrivalsReducer', function () {
        const subject = mount(
            <ProviderMock store={mockStore()}>
                <ArrivalsContainer
                    locationId={123}
                    showArrivals={undefined}
                    loadArrivalData={undefined}
                />
            </ProviderMock>
        );

        it('hands off props to the ArrivalsComponent', function () {
            const arrivalsComponent = subject.find('ArrivalsComponent');

            expect(arrivalsComponent).toExist();

            expect(arrivalsComponent.props().loading).toBe(false);
            expect(arrivalsComponent.props().locationId).toBe(123);
            expect(arrivalsComponent.props().arrivals).toEqual({});
        });
    });
});