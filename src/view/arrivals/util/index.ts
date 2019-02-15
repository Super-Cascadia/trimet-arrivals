import { Moment } from 'moment';

export function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}

export function isEstimatedEarly(estimated: Moment, scheduled: Moment) {
    return estimated.isBefore(scheduled);
}

export function estimatedToArriveAtSameTime (scheduled: Moment, estimated: Moment) {
    return scheduled.isSame(estimated);
}