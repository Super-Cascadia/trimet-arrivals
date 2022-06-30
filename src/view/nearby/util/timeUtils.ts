import { round } from "lodash";
import moment, { Moment } from "moment";

export function getFormattedTime(arrival: number): string {
  return moment(arrival).format("h:mma");
}

export function getNormalizedTimeDifference(time: number, toTime: Moment) {
  const timeMoment = moment(time);
  const minutesUntilArrival = timeMoment.diff(toTime, "minutes");

  return minutesUntilArrival >= 60
    ? `${round(timeMoment.diff(toTime, "hours", true), 1)} hrs`
    : `${minutesUntilArrival} min`;
}

export function getTimeDifferenceInMinutes(time: number, toTime: Moment) {
  const timeMoment = moment(time);
  return timeMoment.diff(toTime, "minutes");
}

export function getTimeUntilArrival(
  estimatedArrivalTime,
  scheduledArrivalTime
) {
  const now = moment();
  const timeStampToDiff = estimatedArrivalTime
    ? estimatedArrivalTime
    : scheduledArrivalTime;
  return getNormalizedTimeDifference(timeStampToDiff, now);
}
