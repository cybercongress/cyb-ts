// Assuming you are using a testing framework like Jest, you can create unit tests for the functions in date.ts as follows:

import {
  numberToDate,
  dateToNumber,
  roundMilliseconds,
  numberToDateWithTimezone,
} from '../date';

test('numberToDate should convert timestamp to formatted date string', () => {
  const timestamp = 1641018600000; // Replace with your timestamp
  const result = numberToDate(timestamp);
  expect(result).toBe('2022-01-01T12:00:00.000'); // Replace with expected result
});

test('dateToNumber should convert ISO string to timestamp', () => {
  const isoString = '2022-01-01T12:00:00.000'; // Replace with your ISO string
  const result = dateToNumber(isoString);
  expect(result).toBe(1641018600000); // Replace with expected result
});

test('roundMilliseconds should round the milliseconds of a date-time string', () => {
  const dateTimeString = '2022-01-01T12:00:00.123'; // Replace with your date-time string
  const result = roundMilliseconds(dateTimeString);
  expect(result).toBe('2022-01-01T12:00:00.000'); // Replace with expected result
});

test('numberToDateWithTimezone should convert number to date with specified timezone', () => {
  const timestamp = 1640995200000;
  const timezoneOffset = 5.5;
  const result = numberToDateWithTimezone(timestamp, timezoneOffset);

  expect(result).toBe('2022-01-01 05:30:00');
});
