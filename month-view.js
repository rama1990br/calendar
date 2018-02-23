(function monthView() {
  function addColumnHeaders(thElements) {
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
  }

  function createRow(j) {
    $('<div/>', {
      id: 'row' + j,
      role: 'row',
      class: 'each-row-container',
    }).appendTo('#rowHolder');
    $('<div/>', {
      id: 'eachRow' + j,
      class: 'each-row',
    }).appendTo('#row' + j);
  }

  function createCell(j, k, dateOfMonth) {
    $('<div/>', {
      id: 'date' + j + k,
      class: 'each-cell',
    }).appendTo('#eachRow' + j);
    $('<h2/>', {
      class: 'each-cell-header',
      text: dateOfMonth,
    }).appendTo('#date' + j + k);
  }

  function createAppointment(j, k) {
    $('<div/>', {
      id: 'appointment' + j + k,
      class: 'appointment',
    }).appendTo('#date' + j + k);
    $('<h2/>', {
      class: 'appointment-text',
      text: 'No events',
    }).appendTo('#appointment' + j + k);
  }

  function displayMonthView() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Days of the Week
      currentMonth = getMonthOfDate(new Date()),
      currentYear = new Date().getFullYear(),
      previousMonth = currentMonth - 1,
      numWeeksInCurrentMonth = weekCount(currentYear, currentMonth),
      sundayOfCurrentWeek = new Date(getSundayOfCurrentWeek(new Date(2018, 1, 1))), // Gives the number of weeks of the current calendar month, not necessarily from 1st to the last date of the current month, but from the first Sunday of the calendar month view to the last date.
      firstSundayOfMonth = sundayOfCurrentWeek.getDate(), // First day of the month in the calendar view, not necessarily the first day of the month
      lastDateOfPreviousMonth = getTheLastDateOfMonth(previousMonth, currentYear),
      currentDate = firstSundayOfMonth,
      i,
      j;

    addColumnHeaders(days);
    for (i = 0; i < numWeeksInCurrentMonth; i++) {
      createRow(i);
      for (j = 0; j < 7; j++) {
        if (currentDate - 1 === lastDateOfPreviousMonth) {
          currentDate = 1;
          if (previousMonth === 11) {
            previousMonth = 0;
            currentYear = currentYear + 1;
          } else {
            previousMonth = previousMonth + 1;
          }
          lastDateOfPreviousMonth = getTheLastDateOfMonth(previousMonth, currentYear);
        }
        createCell(i, j, currentDate);
        currentDate++;
        createAppointment(i, j);
      }
    }
  }
  $(displayMonthView); //  ==> body.onload = function() {} shorthand delayed evaluation
}());
