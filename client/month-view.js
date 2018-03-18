(function monthView() {
  function addColumnHeaders() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Days of the Week
    $('<div/>', {
      class: 'row',
      role: 'columnheader',
    }).appendTo('.month-view');
    $.each(days, function monthDayOfWeekHeader(i, item) {
      $('<div>', {
        class: 'cell',
        text: item,
        role: 'cell',
      }).appendTo($('.row'));
    });
  }

  function createRow(i) {
    $('<div/>', {
      class: 'row',
      attr: ({'data-row-number': i}),
      role: 'row',
    }).appendTo('.month-view');
  }

  function createCell(i, j, classForOpacity) {
    $('<div/>', {
      class: 'cell ' + classForOpacity,
      attr: ({'data-cell-number': j}),
      role: 'cell',
    }).appendTo($('div').find("[data-row-number='" + i + "']"));
  }

  function getNumberFromString(stringInput) {
    return parseInt(stringInput, 10);
  }

  function fillDates(i, j, currentDate, month, year) {
    $( "div[data-row-number='" + i + "'] > div[data-cell-number='" + j + "'" )[0].innerHTML = "<a href='/dayView?date=" + currentDate + '&month=' + month + '&year=' + year + "'>"   + currentDate + '</a>' + '<div>No events</div>';
  }
  function createCalendar(month, year, locale) {
    var numOfWeeksInMonth = weekCount(year, month),
      sundayOfFirstWeek = new Date(getSundayOfCurrentWeek(new Date(year, month, 1))), // Gives the number of weeks of the current calendar month, not necessarily from 1st to the last date of the current month, but from the first Sunday of the calendar month view to the last date.
      firstSundayOfMonth = sundayOfFirstWeek.getDate(), // First day of the month in the calendar view, not necessarily the first day of the month
      lastDateOfMonth = getTheLastDateOfMonth(month, year),
      previousMonth = month === 0 ? 11 : month - 1,
      previousMonthsYear = month === 11 ? year - 1 : year,
      lastDateOfPreviousMonth = getTheLastDateOfMonth(previousMonth, previousMonthsYear),
      currentDate = firstSundayOfMonth,
      i,
      j,
      classForOpacity = '';
    if ($('.month-view').children().length !== 0) {
      $('.month-view').children().remove();
    }
    $('.month-view').data('displayed-month', month);
    $('.month-view').data('displayed-year', year);
    $('#month-name').text(getNameOfMonth(year, month, locale));
    addColumnHeaders();
    for (i = 0; i < numOfWeeksInMonth; i++) {
      createRow(i);
      for (j = 0; j < 7; j++) {
        if ((currentDate - 1 === lastDateOfPreviousMonth && i === 0) || (currentDate - 1 === lastDateOfMonth && i === numOfWeeksInMonth - 1)) {
          currentDate = 1;
        }
        if ((i === 0 && currentDate >= 20) || (i === numOfWeeksInMonth - 1 && currentDate <= 7)) {
          classForOpacity = 'classForOpacity';
        }
        createCell(i, j, classForOpacity);
        fillDates(i, j, currentDate, month, year);
        currentDate++;
        classForOpacity = '';
      }
    }
  }
  function addListenersToPrevAndNextLinks() {
    function displayPreviousMonth() {
      var currentMonth = getNumberFromString($('.month-view').data('displayed-month')),
        currentYear = getNumberFromString($('.month-view').data('displayed-year')),
        previousMonth = currentMonth === 0 ? 11 : currentMonth - 1,
        previousMonthsYear = previousMonth === 11 ? currentYear - 1 : currentYear;
      createCalendar(previousMonth, previousMonthsYear);
    }
    function displayNextMonth() {
      var currentMonth = getNumberFromString($('.month-view').data('displayed-month')),
        currentYear = getNumberFromString($('.month-view').data('displayed-year')),
        nextMonth = currentMonth === 11 ? 0 : currentMonth + 1,
        nextMonthsYear = nextMonth === 0 ? currentYear + 1 : currentYear;
      createCalendar(nextMonth, nextMonthsYear);
    }
    $('#prevButton').click(displayPreviousMonth);
    $('#nextButton').click(displayNextMonth);
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
    addListenersToPrevAndNextLinks();
  }

  function displayMonthView() {
    var currentMonth = getMonthOfDate(new Date()),
      currentYear = getYearOfDate(new Date()),
      locale = 'en-US';
    createCalendar(currentMonth, currentYear, locale);
    createPrevAndNextLinks();
  }
  $(displayMonthView); //  ==> body.onload = function() {} shorthand delayed evaluation
}());
