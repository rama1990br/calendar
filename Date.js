function convertEpochToDateTime(epoch){
	return new Date(epoch);
}

function convertDateTimeToEpoch(dateTime){
	return dateTime.getTime();
}

function getSundayOfCurrentWeekInEpoch(todaysDateInDateTime){
	var dayOfWeek = todaysDateInDateTime.getDay();
	return new Date(todaysDateInDateTime.getTime() - dayOfWeek*86400000).setHours(0,0,0,0);
}

function getSaturdayOfCurrentWeekInEpoch(todaysDateInDateTime){
	var dayOfWeek = todaysDateInDateTime.getDay();
	return new Date(todaysDateInDateTime.getTime() + (6-dayOfWeek)*86400000).setHours(23,59,59,59);
}

function getSundayOfPreviousWeekInEpoch(currentlyDisplayedSundayInEpoch){
	return new Date(currentlyDisplayedSundayInEpoch - 7*86400000).setHours(0,0,0,0);
}

function getSaturdayOfPreviousWeekInEpoch(currentlyDisplayedSundayInEpoch){
	return new Date(currentlyDisplayedSundayInEpoch - 1*86400000).setHours(0,0,0,0);
}
function getSundayOfNextWeekInEpoch(currentlyDisplayedSundayInEpoch){
	return new Date(currentlyDisplayedSundayInEpoch + 7*86400000).setHours(0,0,0,0);
}

function getSaturdayOfNextWeekInEpoch(currentlyDisplayedSundayInEpoch){
	return new Date(currentlyDisplayedSundayInEpoch + 13*86400000).setHours(0,0,0,0);
}
function getSelectedDateInCurrentWeekInEpoch(todaysDate, dayOfWeekNumber, time) {
    var NUMBER_OF_HOURS_IN_DAY = 24;
    var diffInNumberOfDays = todaysDate.getDay() - dayOfWeekNumber;
    return new Date(todaysDate.setHours(todaysDate.getHours() - NUMBER_OF_HOURS_IN_DAY * diffInNumberOfDays)).setHours(time.split(':')[0],time.split(':')[1],0,0);
}

function getDayOfWeekInShortStringFormatFromEpoch(dateInEpoch, locale){
    return (new Date(dateInEpoch * 1000)).toLocaleString(locale, {weekday: 'short'});  //Returns first three letters of day of week,e.g : Tue
}

function getHourFromEpoch(dateInEpoch){
	return (new Date(dateInEpoch * 1000)).getHours(); //Returns the hour (from 0-23)
}