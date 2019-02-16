import { shallow } from 'enzyme';
import React from 'react';
import ArrivalRow from './ArrivalRow';
import moment from 'moment'

describe('ArrivalRow', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                    now={undefined}
                />
            )).not.toThrow();
        });

        it('Has a route indicator', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                    now={undefined}
                />
            );

            const routeIndicator = subject.find('RouteIndicator');

            expect(routeIndicator).toExist();
        });

        it('has a time to arrival indicator', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                    now={undefined}
                />
            );

            const routeIndicator = subject.find('TimeToArrivalIndicator');

            expect(routeIndicator).toExist();
        });

        it('has an on time indicator', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                    now={undefined}
                />
            );

            const routeIndicator = subject.find('OnTimeIndicator');

            expect(routeIndicator).toExist();
        });
    });

    describe('when provided a shortSign', () => {
        it('displays the short sign', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={'123'}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                    now={undefined}
                />
            );

            const routeIndicator = subject.find('.short-sign');

            expect(routeIndicator).toExist();
        });
    });

    describe('when provided the estimated arrival and departure times', () => {
        it('displays the estimated schedule time', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={2999999}
                    estimated={3000399}
                    feet={undefined}
                    now={moment(100000)}
                />
            );

            const estimatedTime = subject.find('.estimated-scheduled-time');

            expect(estimatedTime.text()).toBe('4:50:00 pm / 4:49:59 pm');
        });
    });

    describe('when provided the distance', () => {
        it('shouws how many miles away a vehicle is from the location', () => {
            const subject = shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={100000}
                    now={undefined}
                />
            );

            const distance = subject.find('.distance-in-miles');

            expect(distance.text()).toBe('19 miles');
        });
    });


});