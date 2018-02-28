(function monthView() {
  function addColumnHeaders(thElements) {
    $('<div/>', {
      id: 'tableHeader',
      role: 'columnheader',
      class: 'div-table-row',
    }).appendTo('#tableContainer');
    $.each(thElements, function monthDayOfWeekHeader(i, item) {
      $('<div>', {
        class: 'div-table-cell',
        text: item,
      }).appendTo('#tableHeader');
    });
  }

  function createRow(j) {
    $('<div/>', {
      id: 'row' + j,
      role: 'row',
      class: 'div-table-row',
    }).appendTo('#tableContainer');
  }

  function createCell(j, k, dateOfMonth) {
    $('<div/>', {
      id: 'date' + j + k,
      class: 'div-table-cell',
      text: dateOfMonth,
    }).appendTo('#row' + j);
  }

  function createAppointment(j, k) {
    $('<div/>', {
      id: 'appointment' + j + k,
      text: 'No events',
    }).appendTo('#date' + j + k);
  }

  function createPrevAndNextLinks() {
    function createButton(buttonId, buttonText, appendChildTo) {
      var button = document.createElement('button');
      button.id = buttonId;
      button.innerHTML = buttonText;
      appendChildTo.appendChild(button);
    }
    createButton('prevButton', '<', document.body);
    createButton('nextButton', '>', document.body);
  }

  function getNumberFromString(stringInput) {
    return parseInt(stringInput, 10);
  }
  function addListenersToPrevAndNextLinks() {
    var monthViewTable = document.getElementById('tableContainer'),
      currentMonth = getNumberFromString(monthViewTable.dataset.displayedMonth),
      currentYear = getNumberFromString(monthViewTable.dataset.displayedYear);
    function createNewMonthView(requiredMonth, requiredYear) {
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        previousMonth = requiredMonth === 0 ? 11 : requiredMonth - 1,
        previousMonthsYear = previousMonth === 11 ? requiredYear - 1 : requiredYear,
        numWeeksInRequiredMonth = weekCount(requiredYear, requiredMonth),
        sundayOfFirstWeek = new Date(getSundayOfCurrentWeek(new Date(requiredYear, requiredMonth, 1))), // Gives the number of weeks of the current calendar month, not necessarily from 1st to the last date of the current month, but from the first Sunday of the calendar month view to the last date.
        firstSundayOfMonth = sundayOfFirstWeek.getDate(), // First day of the month in the calendar view, not necessarily the first day of the month
        lastDateOfRequiredMonth = getTheLastDateOfMonth(requiredMonth, requiredYear),
        lastDateOfPreviousMonth = getTheLastDateOfMonth(previousMonth, previousMonthsYear),
        currentDate = firstSundayOfMonth,
        monthName = document.getElementById('monthName');
      monthName.innerHTML = new Date(requiredYear, requiredMonth, 1).toLocaleString('en-US', { month: 'long' });
      document.body.removeChild(monthViewTable);
      monthViewTable = document.createElement('div');
      monthViewTable.id = 'tableContainer';
      document.body.appendChild(monthViewTable);
      addColumnHeaders(days);
      for (i = 0; i < numWeeksInRequiredMonth; i++) {
        createRow(i);
        for (j = 0; j < 7; j++) {
          if ((currentDate - 1 === lastDateOfPreviousMonth && i === 0) || (currentDate - 1 === lastDateOfRequiredMonth && i === numWeeksInRequiredMonth - 1)) {
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
        }
      }
      // document.body.appendChild(monthViewTable);
      // addListenerToCellClick(monthViewTable);
      // getScheduleAndupdateCalendar(requiredWeeksSunday, requiredWeeksSaturday);
      currentMonth = requiredMonth;
      currentYear = requiredYear;
    }
    function getPreviousAppointments() {
      var previousMonth = currentMonth === 0 ? 11 : currentMonth - 1,
        previousYear = previousMonth === 11 ? currentYear - 1 : currentYear;
      createNewMonthView(previousMonth, previousYear);
    }
    function getNextAppointments() {
      var nextMonth = currentMonth === 11 ? 0 : currentMonth + 1,
        nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;
      createNewMonthView(nextMonth, nextYear);
    }
    $('#prevButton').click(getPreviousAppointments);
    $('#nextButton').click(getNextAppointments);
  }

  function displayMonthView() {
    var monthViewTable = document.getElementById('tableContainer'),
      days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Days of the Week
      currentMonth = getMonthOfDate(new Date()),
      currentYear = new Date().getFullYear(),
      previousMonth = currentMonth === 0 ? 11 : currentMonth - 1,
      previousMonthsYear = previousMonth === 11 ? currentYear - 1 : currentYear,
      numWeeksInCurrentMonth = weekCount(currentYear, currentMonth),
      sundayOfCurrentWeek = new Date(getSundayOfCurrentWeek(new Date(currentYear, currentMonth, 1))), // Gives the number of weeks of the current calendar month, not necessarily from 1st to the last date of the current month, but from the first Sunday of the calendar month view to the last date.
      firstSundayOfMonth = sundayOfCurrentWeek.getDate(), // First day of the month in the calendar view, not necessarily the first day of the month
      lastDateOfPreviousMonth = getTheLastDateOfMonth(previousMonth, previousMonthsYear),
      currentDate = firstSundayOfMonth,
      i,
      j,
      monthName = document.getElementById('monthName');
    monthName.innerHTML = new Date(currentYear, currentMonth, 1).toLocaleString('en-US', { month: 'long' });
    monthViewTable.dataset.displayedMonth = currentMonth;
    monthViewTable.dataset.displayedYear = currentYear;
    createPrevAndNextLinks();
    addListenersToPrevAndNextLinks(previousMonth, currentYear, currentMonth + 1);
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
        // createAppointment(i, j);
      }
    }
  }
  $(displayMonthView); //  ==> body.onload = function() {} shorthand delayed evaluation
}());
