import moment, { Moment } from 'moment';

export function secondMinutesDiff(base: Moment, compare: Moment) {
    const diff = base.diff(compare);
    const seconds = moment(diff).seconds();
    const minutes = moment(diff).minutes();

    return { seconds, minutes };
}

export function remainingMinutes(minutes, seconds) {
    const minutesDiff = 59 - minutes;
    const secondsDiff = 60 - seconds;

    return {
        minutesDiff,
        secondsDiff
    }
}