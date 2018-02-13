(function weekView() {// function to create the skeleton of the calendar
  function createCalendarView(id, fromDate) {
    var table,
      thElements,
      th,
      i,
      tr,
      td;

    function createTableHeader(day) {
      th = document.createElement('th');
      th.id = i + day;
      th.innerText = day;
      table.appendChild(th);
    }

    function createTableCell(day) {
      td = document.createElement('td');
      td.id = day + i;
      tr.appendChild(td);
    }

    table = document.createElement('table');
    table.id = id;
    table.dataset.sundayepochtime = fromDate;
    thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    th = document.createElement('th');
    th.innerText = 'Hour of day';
    table.appendChild(th);
    thElements.forEach(createTableHeader);

    for (i = 0; i < 24; i++) {
      tr = document.createElement('tr');
      tr.id = i;
      table.appendChild(tr);
      td = document.createElement('td');
      td.innerText = i + ':00';
      tr.appendChild(td);
      thElements.forEach(createTableCell);
    }
    return table;
  }


  // function to update the table according to the booked appointments
  function updateCalendar(table, data) {
    var locale = 'en-US',
      eventName,
      startRow,
      startTimeDay,
      locationName,
      startTimeHour,
      endTimeHour;
    $.each(data, function displayAppointments(i, item) {
      eventName = item.eventName;
      locationName = item.locationName;
      startTimeDay = getDayOfWeekInShortStringFormat(item.startTime, locale);
      startTimeHour = getHour(item.startTime);
      endTimeHour = getHour(item.endTime);
      startRow = document.getElementById(startTimeHour);
      numberOfHours = endTimeHour - startTimeHour;
      $.each(startRow.childNodes, function displayParticularAppointment(j, eachAppointment) {
        var eventButton = document.createElement('button'),
          cell = document.getElementById(eachAppointment.id),
          count;
        if (eachAppointment.id !== '') {
          count = $('#' + eachAppointment.id).children().length;
        }
        if (eachAppointment.id.includes(startTimeDay)) {
          eventButton.type = 'button';
          eventButton.id = eachAppointment.id + 'Appointment' + parseInt(count + 1, 10);
          eventButton.innerHTML = eventName + ' at ' + locationName;
          eventButton.dataset.eventName = eventName;
          eventButton.dataset.startTime = item.startTime;
          eventButton.dataset.endTime = item.endTime;
          eventButton.dataset.locationName = locationName;
          cell.appendChild(eventButton);
        }
      });
    });
  }

  function clearPrevValuesInModal() {
    $('#dialog input').val('');
    $('#dialog option[selected="selected"]').removeAttr('selected');
  }

  function getNumberFromString(stringInput) {
    return parseInt(stringInput, 10);
  }

  function deleteAppointment(event) {
    var retVal = true;
    if ( retVal === true ) {
      $.ajax({
        url: '/deleteAppointment',
        method: 'POST',
        data: JSON.stringify(event.data.value),
        cache: false,
        success: function deleteSelectedAppointment() {
          $('#dialog').dialog('close');
          // displayCalendar();
        },
      });
    }
  }

  function confirmModal(event) {
    var table = document.getElementById('calendar-id'),
      epochTime = getNumberFromString(table.dataset.sundayepochtime),
      clickedIndex = event.data.clickedColumnIndex,
      startTimeValue = $('#startTime option:selected').text(),
      endTimeValue = $('#endTime option:selected').text(),
      epochStartTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, startTimeValue),
      epochEndTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, endTimeValue),
      sendInfo = {
        eventName: $('#eventName').val(),
        startTime: epochStartTimeOfEvent,
        endTime: epochEndTimeOfEvent,
        locationName: $('#locationName').val(),
      },
      bookedEventArray = [sendInfo];

    event.preventDefault();
    $.ajax({
      url: '/',
      method: 'POST',
      data: JSON.stringify(sendInfo),
      cache: false,
      success: function postNewAppointment() {
        $('#dialog').dialog('close');
        updateCalendar(table, bookedEventArray);
      },
    });
  }

  function removePreviousAppointment(table, previousEvent) {
    startTimeDay = getDayOfWeekInShortStringFormat(getNumberFromString(previousEvent.startTime), 'en-US');
    startTimeHour = getHour(getNumberFromString(previousEvent.startTime));
    endTimeHour = getHour(getNumberFromString(previousEvent.endTime));
    startRow = document.getElementById(startTimeHour);
    numberOfHours = endTimeHour - startTimeHour;
    $.each(startRow.childNodes, function displayParticularAppointment(j, eachAppointment) {
      var cell = document.getElementById(eachAppointment.id);
      if (eachAppointment.id.includes(startTimeDay)) {
        cell.removeChild(document.getElementById(eachAppointment.id + 'Appointment1'));
      }
    });
  }

  function editModal(event) {
    var table = document.getElementById('calendar-id'),
      epochTime = getNumberFromString(table.dataset.sundayepochtime),
      clickedIndex = event.data.clickedColumnIndex,
      startTimeValue = $('#startTime option:selected').text(),
      endTimeValue = $('#endTime option:selected').text(),
      epochStartTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, startTimeValue),
      epochEndTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, endTimeValue),
      sendInfo = {
        eventName: $('#eventName').val(),
        startTime: epochStartTimeOfEvent,
        endTime: epochEndTimeOfEvent,
        locationName: $('#locationName').val(),
        previousEvent: event.data.value.startTime,
      },
      previousEvent = event.data.value,
      bookedEventArray = [sendInfo];
    event.preventDefault();
    $.ajax({
      url: '/editAppointment',
      method: 'POST',
      data: JSON.stringify(sendInfo),
      cache: false,
      success: function editAppointment() {
        $('#dialog').dialog('close');
        removePreviousAppointment(table, previousEvent);
        updateCalendar(table, bookedEventArray);
      },
    });
  }


  // cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is
  // encountered in the displayModal method and therefore is called multiple times on each cancel button click.
  function cancelModal() {
    $('#dialog').dialog('close');
  }
  function displayModal(evt) {
    var startTime,
      deleteInfo,
      regexInt = /\d+/,
      $dialog = $('#dialog');
    clearPrevValuesInModal();
    $dialog.dialog({autoOpen: false});
    $dialog.dialog('open');
    function populateModal(eventName, eventStartTime, eventEndTime, locationName, cancelButtonText) {
      $('#eventName').val(eventName);
      $('#st' + startTime).attr('selected', 'selected');
      $('#et' + endTime).attr('selected', 'selected');
      $('#locationName').val(locationName);
      $('#cancelOrDelete').text(cancelButtonText);
    }
    if (evt.target.tagName === 'BUTTON') {
      deleteInfo = {
        eventName: evt.target.dataset.eventName,
        startTime: evt.target.dataset.startTime,
        endTime: evt.target.dataset.endTime,
        locationName: evt.target.dataset.locationName,
      };
      populateModal(deleteInfo.eventName, getHour(getNumberFromString(deleteInfo.startTime)), getHour(getNumberFromString(deleteInfo.endTime)), deleteInfo.locationName, 'Delete');
      $('#cancelOrDelete').on('click', { value: deleteInfo }, deleteAppointment);
      $('#confirm').click({clickedColumnIndex: parseInt( $(this).index() - 1, 10), value: deleteInfo }, editModal);
    } else {
      hour = evt.target.id.match(regexInt);
      startTime = hour ? parseInt(hour[0], 10) : 0;
      $('#st' + startTime).attr('selected', 'selected');
      $('#cancelOrDelete').text('Cancel');
      $('#cancelOrDelete').click(cancelModal);
      $('#confirm').click({clickedColumnIndex: parseInt( $(this).index() - 1, 10)}, confirmModal);
    }
  }

  function addListenerToCellClick(table) {
    $('#' + table.id + ' td').click(displayModal);
  }


  function getScheduleAndupdateCalendar(table, fromDate, toDate) {
    $.ajax({
      url: '/appointments',
      data: {
        'fromDate': fromDate,
        'toDate': toDate,
      },
      type: 'get',
      cache: false,
      success: function getParticularAppointments(data) {
        updateCalendar(table, data);
      },
    });
  }


  function addListenersToPrevAndNextLinks() {
    var calendarElement = document.getElementById('calendar-id'),
      sundayOfCurrentWeek =  (calendarElement !== null) ? getNumberFromString(calendarElement.dataset.sundayepochtime) : undefined;
    function createNewWeekViewAndUpdateAppointments(requiredWeeksSunday, requiredWeeksSaturday) {
      var table;
      document.body.removeChild(calendarElement);
      table = createCalendarView('calendar-id', requiredWeeksSunday, requiredWeeksSaturday);
      document.body.appendChild(table);
      addListenerToCellClick(table);
      getScheduleAndupdateCalendar(table, requiredWeeksSunday, requiredWeeksSaturday);
    }
    function getPreviousAppointments() {
      var previousSunday = getSundayOfPreviousWeek(sundayOfCurrentWeek),
        previousSaturday = getSaturdayOfPreviousWeek(sundayOfCurrentWeek);
      createNewWeekViewAndUpdateAppointments(previousSunday, previousSaturday);
    }
    function getNextAppointments() {
      var nextSunday = getSundayOfNextWeek(sundayOfCurrentWeek),
        nextSaturday = getSaturdayOfNextWeek(sundayOfCurrentWeek);
      createNewWeekViewAndUpdateAppointments(nextSunday, nextSaturday);
    }
    $('#prevButton').click(getPreviousAppointments);
    $('#nextButton').click(getNextAppointments);
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


  function removeExistingWeekView(calendarElement) {
    document.body.removeChild(document.getElementById('prevButton'));
    document.body.removeChild(document.getElementById('nextButton'));
    document.body.removeChild(calendarElement);
  }


  function displayWeekView() {
    var table,
      calendarElement = document.getElementById('calendar-id'),
      sundayEpochTime = (calendarElement !== null) ? getNumberFromString(calendarElement.dataset.sundayepochtime) : undefined;
    createPrevAndNextLinks();
    if (sundayEpochTime !== undefined) { // if the current week view is being displayed, sundayEpochTime isn't set as yet. If previous or next week views are to be displayed, sundayEpochTime is set.
      removeExistingWeekView(calendarElement);
      table = createCalendarView('calendar-id', sundayEpochTime);
      getScheduleAndupdateCalendar(table, sundayEpochTime, getSaturdayOfCurrentWeek(convertEpochToDateTime(sundayEpochTime)));
    } else {
      table = createCalendarView('calendar-id', getSundayOfCurrentWeek(new Date()));
      getScheduleAndupdateCalendar(table, getSundayOfCurrentWeek(new Date()), getSaturdayOfCurrentWeek(new Date()));
    }
    document.body.appendChild(table);
    addListenerToCellClick(table);
  }
  $(displayWeekView);
}());
