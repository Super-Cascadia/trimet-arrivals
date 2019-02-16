import { shallow } from 'enzyme';
import React from 'react';
import ArrivalsComponent from './ArrivalsComponent';

describe('ArrivalsComponent', () => {
    describe('by default', () => {
        it('renders without crashing', () => {
            expect(() => shallow(
                <ArrivalsComponent
                    arrivals={undefined}
                    loading={undefined}
                    now={undefined}
                    locationId={undefined}
                    loadArrivalData={undefined}
                    showArrivals={undefined}
                />
            )).not.toThrow();
        });
    });
});