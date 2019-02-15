import { shallow } from 'enzyme';
import React from 'react';
import OnTimeIndicator from './OnTimeIndicator';

describe('OnTimeIndicator', () => {
    describe('by default', function () {
        it('renders without crashing', () => {
            expect(() => shallow(
                <OnTimeIndicator
                    scheduled={undefined}
                    estimated={undefined}
                />
            )).not.toThrow();
        });
    });
});