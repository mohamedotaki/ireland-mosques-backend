// utils/datetime.js
const moment = require("moment-timezone");

// Default timezone and format
const DEFAULT_TIMEZONE = "Europe/Dublin";
const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss";

// Get current time in UTC for DB storage
const getNowUTC = () => {
  return moment().utc().format(DEFAULT_FORMAT);
};

// Get current time in local timezone
const getNowLocal = () => {
  return moment.tz(DEFAULT_TIMEZONE).format(DEFAULT_FORMAT);
};

// Convert UTC date string (from DB) to local timezone
const toLocalTime = (utcString) => {
  return moment.utc(utcString).tz(DEFAULT_TIMEZONE).format(DEFAULT_FORMAT);
};

// Convert local datetime to UTC (before storing to DB, if needed)
const toUTC = (localString) => {
  return moment.tz(localString, DEFAULT_TIMEZONE).utc().format(DEFAULT_FORMAT);
};

module.exports = {
  getNowUTC,
  getNowLocal,
  toLocalTime,
  toUTC,
  DEFAULT_TIMEZONE,
  DEFAULT_FORMAT,
};
