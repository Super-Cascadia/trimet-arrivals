import { shallow } from 'enzyme';
import React from 'react';
import ArrivalRow from './ArrivalRow';

describe('ArrivalRow', () => {
    describe('by default', function () {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ArrivalRow
                    route={undefined}
                    shortSign={undefined}
                    scheduled={undefined}
                    estimated={undefined}
                    feet={undefined}
                />
            )).not.toThrow();
        });
    });
});