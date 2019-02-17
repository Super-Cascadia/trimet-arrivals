import { loadArrivalData, loadStopData } from './stopActions';
import { LOAD_ARRIVALS_COMPLETE, LOAD_ARRIVALS, LOAD_STOPS, LOAD_STOP_COMPLETE } from '../constants';
import { getArrivals } from '../../api/trimet/arrivals';
import { getNearbyStops } from '../../api/trimet/stops';

jest.mock('../../api/trimet/util', () => {
    return {
        getTrimetData() {
            return Promise.resolve({ foo: 'bar' });
        }
    }
});

jest.mock('../../api/geolocation', () => {
    return {
        getCurrentPosition() {
            return Promise.resolve({ foo: 'bar' });
        }
    }
});

jest.mock('../../api/trimet/arrivals', () => {
    return {
        getArrivals () {
            return Promise.resolve({ foo: 'bar' });
        }
    };
});

jest.mock('../../api/trimet/stops', () => {
    return {
        getNearbyStops () {
            return Promise.resolve({ foo: 'bar' });
        }
    };
});

describe('stopActions', () => {
    describe('loadArrivalData', function () {
        const dispatchMock = jasmine.createSpy('dispatchMock');
        loadArrivalData(123)(dispatchMock);

        it('dispatchses the LOAD_ARRIVAL action', function () {
            expect(dispatchMock).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                type: LOAD_ARRIVALS,
                payload: {
                    locationId: 123
                }
            });
        });

        it('dispatchses the LOAD_ARRIVAL_COMPLETE action', function (done) {
            getArrivals().then(() => {
                expect(dispatchMock).toHaveBeenCalledWith({
                  type: LOAD_ARRIVALS_COMPLETE,
                  payload: {
                      locationId: 123,
                      arrivalData: {
                          foo: 'bar'
                      }
                  }
                });

                done();
            });
        });
    });

    describe('loadStopData', function () {
        const dispatchMock = jasmine.createSpy('dispatchMock');
        loadStopData(123)(dispatchMock);

        it('dispatches the LOAD_ARRIVAL action', function () {
            expect(dispatchMock).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
              type: LOAD_STOPS
            });
        });

        it('dispatchses the LOAD_ARRIVAL_COMPLETE action', function (done) {
            const location = { coords: { longitude: 123, latitude: 123 } };

            getNearbyStops(location, 123).then(() => {
                expect(dispatchMock).toHaveBeenCalledWith({
                      type: LOAD_STOP_COMPLETE,
                      payload: {
                          stopData: {
                              foo: 'bar'
                          }
                      }
                  });

                done();
            });
        });
    });
});