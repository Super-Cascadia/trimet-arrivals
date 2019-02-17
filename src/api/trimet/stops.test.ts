import { getTrimetData } from './util';
import { getNearbyStops } from './stops';

jest.mock('./util', () => {
    return {
        getTrimetData() {
            return Promise.resolve({ foo: 'bar' });
        }
    }
})

describe('stops', () => {
    const location = {
        coords: {
            longitude: 123,
            latitude: 123
        }
    };

    getNearbyStops(location, 123);

    it('foo', function (done) {
        getTrimetData().then((result) => {
            expect(result).toEqual({ foo: 'bar' });
            done();
        });
    });
})