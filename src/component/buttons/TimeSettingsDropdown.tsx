import React from "react";
import { NavDropdown } from "react-bootstrap";
import {
  fetchStoredTimeFormat,
  storeTimeFormat,
  TimeFormat,
} from "../../api/localstorage/timeFormat.localstorage";
import {
  fetchStoredTimezone,
  storeTimezone,
  TimezoneType,
} from "../../api/localstorage/timezone.localstorage";

export default function TimeSettingsDropdown() {
  const [timeFormat, setTimeFormat] = React.useState<TimeFormat>(() =>
    fetchStoredTimeFormat()
  );
  const [timezone, setTimezone] = React.useState<TimezoneType>(() =>
    fetchStoredTimezone()
  );

  const handleTimeFormatToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newFormat = timeFormat === "12h" ? "24h" : "12h";
    setTimeFormat(newFormat);
    storeTimeFormat(newFormat);
  };

  const handleTimezoneToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newTimezone = timezone === "local" ? "utc" : "local";
    setTimezone(newTimezone);
    storeTimezone(newTimezone);
  };

  return (
    <>
      <NavDropdown.Item onClick={handleTimeFormatToggle}>
        Time Format: {timeFormat === "12h" ? "12-hour" : "24-hour"}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleTimezoneToggle}>
        Timezone: {timezone === "local" ? "Local" : "UTC"}
      </NavDropdown.Item>
    </>
  );
}
