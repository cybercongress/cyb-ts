import moment from 'moment';

const numberToDate = (timestamp: number) =>
  moment(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS');

const dateToNumber = (isoString: string) =>
  moment(isoString, 'YYYY-MM-DDTHH:mm:ss.SSS').valueOf();

function roundMilliseconds(dateTimeString: string) {
  // Parse the date-time string
  const momentDate = moment(dateTimeString);

  // Round the milliseconds
  const roundedMilliseconds = Math.round(momentDate.milliseconds() / 10) * 10;
  momentDate.milliseconds(roundedMilliseconds);

  // Format and return the date-time string with rounded milliseconds
  return momentDate.format('YYYY-MM-DDTHH:mm:ss.SSS');
}
export { numberToDate, dateToNumber, roundMilliseconds };
