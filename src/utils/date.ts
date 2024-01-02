import dateFormat from 'dateformat';

const numberToDate = (timestamp: number) =>
  dateFormat(new Date(timestamp), 'yyyy-mm-dd"T"HH:MM:ss.l');

const dateToNumber = (isoString: string) => Date.parse(isoString);

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

export {
  numberToDate,
  dateToNumber,
  roundMilliseconds,
  numberToDateWithTimezone,
};
