function convertEpochToDateTime(epoch) {
  return new Date(epoch);
}

function convertDateTimeToEpoch(dateTime) {
  return dateTime.getTime();
}

function getSundayOfCurrentWeek(todaysDateInDateTime) {
  var dayOfWeek = todaysDateInDateTime.getDay();
  return new Date(todaysDateInDateTime.getTime() - dayOfWeek * 86400000).setHours(0, 0, 0, 0);
}

function getSaturdayOfCurrentWeek(todaysDateInDateTime) {
  var dayOfWeek = todaysDateInDateTime.getDay();
  return new Date(todaysDateInDateTime.getTime() + (6 - dayOfWeek) * 86400000).setHours(23, 59, 59, 59);
}

function getSundayOfPreviousWeek(currentlyDisplayedSunday) {
  return new Date(currentlyDisplayedSunday - 7 * 86400000).setHours(0, 0, 0, 0);
}

function getSaturdayOfPreviousWeek(currentlyDisplayedSunday) {
  return new Date(currentlyDisplayedSunday - 1 * 86400000).setHours(23, 59, 59, 59);
}
function getSundayOfNextWeek(currentlyDisplayedSunday) {
  return new Date(currentlyDisplayedSunday + 7 * 86400000).setHours(0, 0, 0, 0);
}

function getSaturdayOfNextWeek(currentlyDisplayedSunday) {
  return new Date(currentlyDisplayedSunday + 13 * 86400000).setHours(23, 59, 59, 59);
}
function getSelectedDateInCurrentWeek(todaysDateInDateTime, dayOfWeekNumber, time) {
  var NUMBER_OF_HOURS_IN_DAY = 24;
  var diffInNumberOfDays = todaysDateInDateTime.getDay() - dayOfWeekNumber;
  return new Date(todaysDateInDateTime.setHours(todaysDateInDateTime.getHours() - NUMBER_OF_HOURS_IN_DAY * diffInNumberOfDays)).setHours(time.split(':')[0], time.split(':')[1], 0, 0);
}

function getDayOfWeekInShortStringFormat(date, locale) {
  return (new Date(date)).toLocaleString(locale, {weekday: 'short'});  // Returns first three letters of day of week,e.g : Tue
}

function getDayOfWeek(date, locale) {
  return date.toLocaleString(locale, {weekday: 'long', month: 'long', day: '2-digit', year: 'numeric'});
}
function getHour(date) {
  return (new Date(date)).getHours(); // Returns the hour (from 0-23)
}

function getTheFirstDateInTheMonth(date) {
  dateInDateTime = convertEpochToDateTime(date);
  return new Date(dateInDateTime.getFullYear(), dateInDateTime.getMonth() + 1, 0).getDate();
}

function getTheLastDateOfMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthOfDate(date) {
  return date.getMonth();
}

function getYearOfDate(date) {
  return date.getFullYear();
}
function weekCount(year, monthNumber) {
  // month_number is in the range 0..11
  var firstOfMonth = new Date(year, monthNumber, 1);
  var lastOfMonth = new Date(year, monthNumber + 1, 0);
  var used = firstOfMonth.getDay() + lastOfMonth.getDate();
  return Math.ceil( used / 7);
}

function getNameOfMonth(year, month, locale) {
  return new Date(year, month, 1).toLocaleString(locale, { month: 'long' });
}
