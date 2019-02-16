import { shallow } from 'enzyme';
import React from 'react';
import StopsComponent from './StopsComponent';
import { StopLocation } from '../../api/trimet/types';

describe('ArrivalsContainer', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <StopsComponent
                    loadStopData={undefined}
                    loading={undefined}
                    stopLocations={undefined}
                    timeOfLastLoad={undefined}
                />
            )).not.toThrow();
        });
    });

    describe('when mounted', function () {
        describe('and loadStopData is provided', function () {
            it('the loadStopData delegate is called', function () {
                const loadStopData = jasmine.createSpy('loadStopDataSpy')

                const subject = shallow(
                    <StopsComponent
                        loadStopData={loadStopData}
                        loading={undefined}
                        stopLocations={undefined}
                        timeOfLastLoad={undefined}
                    />
                );

                expect(loadStopData).toHaveBeenCalled()
                expect(loadStopData).toHaveBeenCalledWith(750)
            });
        });
    });

    describe('when loading', function () {
        it('shows a loading message', function () {
            const subject = shallow(
                <StopsComponent
                    loadStopData={undefined}
                    loading={true}
                    stopLocations={undefined}
                    timeOfLastLoad={undefined}
                />
            );

            expect(subject.find('.loading-message').text()).toBe("Loading...")
        });
    });

    describe('when not loading', function () {
        describe('and stop locations are provided', function () {
            const stopLocations = {
                123: {} as StopLocation
            };
            const subject = shallow(
                <StopsComponent
                    loadStopData={undefined}
                    loading={false}
                    stopLocations={stopLocations}
                    timeOfLastLoad={"12:01pm"}
                />
            );
            const nearbyStops = subject.find('.nearby-stops');

            it('shows nearby stops', function () {
                expect(nearbyStops).toExist();
            });

            describe('the nearby stops list', function () {
                it('has a heading and the time of last load', function () {
                    expect(nearbyStops.find('h1').text()).toBe('Nearby Stops | 12:01pm')
                });

                it('shows Stops', function () {
                    expect(nearbyStops.find("Stops")).toExist()
                });
            });
        });
    });
});