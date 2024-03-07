import dateFormat from 'dateformat';

const numberToDate = (timestamp: number) =>
  dateFormat(new Date(timestamp), 'yyyy-mm-dd"T"HH:MM:ss.l');

const dateToNumber = (isoString: string) => Date.parse(isoString);

const getNowUtcTime = (): number => {
  const now = new Date();
  const utcTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  return utcTime.getTime();
};
//
function roundMilliseconds(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const roundedMilliseconds = Math.round(date.getMilliseconds() / 1000) * 1000;
  date.setMilliseconds(roundedMilliseconds);
  return dateFormat(date, 'yyyy-mm-dd"T"HH:MM:ss.l');
}
function getCurrentTimezoneOffset() {
  const now = new Date();
  return -now.getTimezoneOffset() / 60;
}

function numberToDateWithTimezone(timestamp: number, timezoneOffset?: number) {
  // Convert timestamp from milliseconds to a Date object
  const date = new Date(timestamp);

  const tzOffset = timezoneOffset || getCurrentTimezoneOffset();
  console.log('---tzOffset', tzOffset);
  // Adjust the date for the timezone offset
  // The timezoneOffset is in hours for the target timezone relative to UTC
  const localTime = date.getTime();
  const localOffset = date.getTimezoneOffset() * 60000; // in milliseconds
  const utc = localTime + localOffset;
  const timezoneDate = new Date(utc + 3600000 * tzOffset);

  // Format the date using dateFormat
  return dateFormat(timezoneDate, 'yyyy-mm-dd HH:MM:ss');
}

function pluralizeUnit(quantity: number, unit: string): string {
  return quantity === 1 ? unit : `${unit}s`;
}

const minuteInMs = 60000; // 60 seconds * 1000 milliseconds
const hourInMs = 3600000; // 60 minutes * 60 seconds * 1000 milliseconds
const dayInMs = 86400000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

function convertTimestampToString(timestamp: number): string {
  if (timestamp < minuteInMs) {
    const seconds = Math.floor(timestamp / 1000);
    return `${seconds} ${pluralizeUnit(seconds, 'second')}`;
  }
  if (timestamp < hourInMs) {
    const minutes = Math.floor(timestamp / minuteInMs);
    return `${minutes} ${pluralizeUnit(minutes, 'minute')}`;
  }
  if (timestamp < dayInMs) {
    const hours = Math.floor(timestamp / hourInMs);
    return `${hours} ${pluralizeUnit(hours, 'hour')}`;
  }

  const days = Math.floor(timestamp / dayInMs);
  return `${days} ${pluralizeUnit(days, 'day')}`;
}

export {
  numberToDate,
  dateToNumber,
  getNowUtcTime,
  roundMilliseconds,
  numberToDateWithTimezone,
  convertTimestampToString,
};
