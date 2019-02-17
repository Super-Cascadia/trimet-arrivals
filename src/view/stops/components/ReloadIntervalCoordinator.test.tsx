import { mount, shallow } from 'enzyme';
import React from 'react';
import ReloadIntervalCoordinator from './ReloadIntervalCoordinator';
import { StopLocation } from '../../../api/trimet/types';

describe('ReloadIntervalCoordinator', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ReloadIntervalCoordinator
                    stopLocation={undefined}
                    loadArrivalData={undefined}
                    loading={undefined}
                    showArrivals={undefined}
                />
            )).not.toThrow();
        });
    });

    describe('when a stop location is provided', function () {
        describe('default behavior', function () {
            const stopLocation = {

            } as StopLocation;

            const subject = shallow(
                <ReloadIntervalCoordinator
                    stopLocation={stopLocation}
                    loadArrivalData={undefined}
                    loading={undefined}
                    showArrivals={undefined}
                />
            );

            const reloadButton = subject.find('ReloadButton');

            it('has a reload button', function () {
                expect(reloadButton).toExist();
            });

            it('the reload button shows the current coutdown interval', function () {
                expect(reloadButton.find('.count-down-label').text()).toBe('30');
            });
        });

        describe('when the reload button is clicked', function () {
            const stopLocation = {

            } as StopLocation;

            const loadArrivalDataSpy = jasmine.createSpy('loadArrivalSpy');

            const subject = mount(
                <ReloadIntervalCoordinator
                    stopLocation={stopLocation}
                    loadArrivalData={loadArrivalDataSpy}
                    loading={undefined}
                    showArrivals={undefined}
                />
            );

            subject.find('button').simulate('click');

            it('the load arrival data delegate is called', function () {
                expect(loadArrivalDataSpy).toHaveBeenCalled();
            });
        });
    });
});