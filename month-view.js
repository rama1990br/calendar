(function monthView() {
  function displayMonthView() {
    var thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Days of the Week
      numberOfWeeksInAMonth = weekCount(new Date().getYear(), new Date().getMonth()), // Gives the number of weeks of the current calendar month, not necessarily from 1st to the last date of the current month, but from the first Sunday of the calendar month view to the last date.
      firstSundayOfMonthView = new Date(getSundayOfCurrentWeek(new Date(2018, 1, 1))).getDate(), // First day of the month in the calendar view, not necessarily the first day of the month
      monthOfFirstSundayOfCurrentWeek = new Date(getSundayOfCurrentWeek(new Date(2018, 1, 1))).getMonth(),
      lastDateOfPreviousMonth,
      lastDateOfCurrentMonth,
      dateOfMonth,
      sundayOfCurrentWeek,
      j,
      k;
    if (monthOfFirstSundayOfCurrentWeek !== new Date().getMonth()) { // Incase some dates from the previous month are displayed in the current month view
      lastDateOfPreviousMonth = getTheLastDateInTheMonth(firstSundayOfMonthView);
      lastDateOfCurrentMonth = getTheLastDateInTheMonth(new Date());
    } else {
      lastDateOfCurrentMonth = getTheLastDateInTheMonth(new Date());
    }
    $.each(thElements, function monthDayOfWeekHeader(i, item) {
      $('<div/>', {
        id: item,
        role: 'columnheader',
        class: 'column-header',
      }).appendTo('#weekOfDayHeader');

      $('<span/>', {
        class: 'column-header-text',
        text: item,
      }).appendTo('#' + item);
    });
    for (k = 0; k < numberOfWeeksInAMonth; k += 1) {
      dateOfMonth = k === 0 ? firstSundayOfMonthView : dateOfMonth;
      $('<div/>', {
        id: 'row' + k,
        role: 'row',
        class: 'each-row-container',
      }).appendTo('#rowHolder');
      $('<div/>', {
        id: 'eachRow' + k,
        class: 'each-row',
      }).appendTo('#row' + k);
      for (j = 0; j < 7; j += 1) {
        if (lastDateOfPreviousMonth !== undefined) {
          dateOfMonth = (dateOfMonth - 1) === lastDateOfPreviousMonth ? 1 : dateOfMonth;
        }
        if (k === numberOfWeeksInAMonth - 1) {
          dateOfMonth = (dateOfMonth - 1) === lastDateOfCurrentMonth ? 1 : dateOfMonth;
        }
        $('<div/>', {
          id: 'date' + k + j,
          class: 'each-cell',
        }).appendTo('#eachRow' + k);
        $('<h2/>', {
          class: 'each-cell-header',
          text: dateOfMonth,
        }).appendTo('#date' + k + j);
        $('<div/>', {
          id: 'rowEvent' + k + j,
          // role: 'row',
          class: 'row-event',
        }).appendTo('#date' + k + j);
        $('<div/>', {
          id: 'dayAppointment' + k + j,
          role: 'presentation',
          class: 'row-presentation',
        }).appendTo('#rowEvent' + k + j);
        $('<div/>', {
          id: 'appointment' + k + j,
          role: 'gridcell',
          class: 'gridcell',
        }).appendTo('#dayAppointment' + k + j);
        $('<h2/>', {
          class: 'gridcell-text',
          text: 'No events',
        }).appendTo('#appointment' + k + j);
        dateOfMonth = dateOfMonth + 1;
      }
    }
  }
  $(displayMonthView); //  ==> body.onload = function() {} shorthand delayed evaluation
}());
