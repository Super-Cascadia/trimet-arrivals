import React from "react";
import { Nav } from "react-bootstrap";
import {
  fetchStoredTimeFormat,
  TimeFormat,
} from "../../api/localstorage/timeFormat.localstorage";
import {
  fetchStoredTimezone,
  TimezoneType,
} from "../../api/localstorage/timezone.localstorage";
import "./CurrentTime.scss";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [timeFormat, setTimeFormat] = React.useState<TimeFormat>(() =>
    fetchStoredTimeFormat()
  );
  const [timezone, setTimezone] = React.useState<TimezoneType>(() =>
    fetchStoredTimezone()
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date, format: TimeFormat, tz: TimezoneType): string => {
    let hours: number;
    let minutes: number;
    let seconds: number;

    if (tz === "utc") {
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
      seconds = date.getUTCSeconds();
    } else {
      hours = date.getHours();
      minutes = date.getMinutes();
      seconds = date.getSeconds();
    }

    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");

    if (format === "24h") {
      const hoursStr = hours.toString().padStart(2, "0");
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    } else {
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutesStr}:${secondsStr} ${ampm}`;
    }
  };

  const getTimezoneLabel = () => {
    return timezone === "utc" ? " UTC" : "";
  };

  return (
    <Nav.Link className="current-time" style={{ cursor: "default" }}>
      {formatTime(currentTime, timeFormat, timezone)}{getTimezoneLabel()}
    </Nav.Link>
  );
}
