import { shallow, mount } from 'enzyme';
import React from 'react';
import ArrivalsContainer from './ArrivalsContainer';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Arrival } from '../../api/trimet/types';

interface ProviderMockProps {
    children: JSX.Element
    store?: any
}

function ProviderMock({ children, store }: ProviderMockProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
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
        const initialState = {
            loading: false,
            timeOfLastLoad: ''
        };

        const arrivalsReducer = (state = initialState) => { return state; };

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

        const store = createStore(combineReducers({ arrivalsReducer }), baseState, applyMiddleware(thunk));

        const subject = mount(
            <ProviderMock store={store}>
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