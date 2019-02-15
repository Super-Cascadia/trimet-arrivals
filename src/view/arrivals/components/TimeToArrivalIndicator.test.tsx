import { shallow } from 'enzyme';
import React from 'react';
import TimeToArrivalIndicator from './TimeToArrivalIndicator';

describe('TimeToArrivalIndicator', () => {
    describe('by default', function () {
        it('renders without crashing', () => {
            shallow(
                <TimeToArrivalIndicator
                    estimated={undefined}
                />
            );
        });
    });
})