// function to create the skeleton of the calendar
function createCalendarView(id, fromDate) {
  var table;
  var thElements;
  var th;
  var i;
  var tr;
  var td;

  function createTableHeader(day) {
    th = document.createElement('th');
    th.id = i + day;
    th.innerText = day;
    table.appendChild(th);
  }

  function createTableCells(day) {
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
    thElements.forEach(createTableCells);
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
      var eventButton = document.createElement('button');
      // var rowspan = endTimeHour - startTimeHour + 1;
      var cell = document.getElementById(eachAppointment.id);
      if (eachAppointment.id.includes(startTimeDay)) {
        eventButton.type = 'button';
        eventButton.id = eachAppointment.id + 'Appointment1';
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

function deleteAppointment(deleteInfo) {
  var retVal = true;
  if ( retVal === true ) {
    $.ajax({
      url: '/deleteAppointment',
      method: 'POST',
      data: JSON.stringify(deleteInfo),
      cache: false,
      success: function deleteSelectedAppointment() {
      },
    });
    $('#dialog').dialog('close');
  }
}

// cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is
// encountered in the displayModal method and therefore is called multiple times on each cancel button click.
function cancelModal() {
  $('#dialog').dialog('close');
}

function confirmModal(event) {
  var epochStartTimeOfEvent = getSelectedDateInCurrentWeek(new Date(parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10)), event.data.clickedColumnIndex, $('#startTime option:selected').text());
  var epochEndTimeOfEvent = getSelectedDateInCurrentWeek(new Date(parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10)), event.data.clickedColumnIndex, $('#endTime option:selected').text());
  var sendInfo = {
    eventName: $('#eventName').val(),
    startTime: epochStartTimeOfEvent,
    endTime: epochEndTimeOfEvent,
    locationName: $('#locationName').val(),
  };
  var table = document.getElementById('calendar-id');
  var bookedEventArray = [sendInfo];
  event.preventDefault();
  $.ajax({
    url: '/',
    method: 'POST',
    data: JSON.stringify(sendInfo),
    cache: false,
    success: function postNewAppointment() {
    },
  });

  $('#dialog').dialog('close');
  updateCalendar(table, bookedEventArray);
}

function clearPrevValuesInModal() {
  $('#dialog input').val('');
  $('#dialog option[selected="selected"]').removeAttr('selected');
}


function displayModal(evt) {
  var startTime,
    regexInt = /\d+/,
    $dialog = $('#dialog');
  var deleteInfo = {
    eventName: evt.target.dataset.eventName,
    startTime: evt.target.dataset.startTime,
    endTime: evt.target.dataset.endTime,
    locationName: evt.target.dataset.locationName,
  };
  clearPrevValuesInModal();
  $dialog.dialog({autoOpen: false});
  $dialog.dialog('open');
  // var getBackMyJSON = $('#' + evt.target.id).data('key');
  if (evt.target.tagName === 'BUTTON') {
    // $(evt.target).val(evt.target.value);
    $('#eventName').val(evt.target.dataset.eventName);
    $('#st' + new Date(evt.target.dataset.startTime / 1000).getHours()).attr('selected', 'selected');
    $('#et' + new Date(evt.target.dataset.endTime / 1000).getHours()).attr('selected', 'selected');
    $('#locationName').val(evt.target.dataset.locationName);
    $('#cancelOrDelete').text('Delete');
    $('#cancelOrDelete').click(deleteAppointment, deleteInfo);
  } else {
    $('#eventName').val('');
    hour = evt.target.id.match(regexInt);
    startTime = hour ? parseInt(hour[0], 10) : 0;
    $('#st' + startTime).attr('selected', 'selected');
    $('#locationName').val('');
    $('#cancelOrDelete').text('Cancel');
    $('#cancelOrDelete').click(cancelModal);
  }

  // Form cancel button closes the dialog buttonText
  $('#confirm').click({clickedColumnIndex: parseInt( $(this).index() - 1, 10)}, confirmModal);
}


function addListenerToCellClick(table) {
  $(table).click(displayModal);
}


function addListenersToPrevAndNextLinks() {
  $('#prevButton').click(function getPreviousAppointments() {
    var sundayOfCurrentWeek =  parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10);
    var previousSunday = getSundayOfPreviousWeek(sundayOfCurrentWeek);
    var previousSaturday = getSaturdayOfPreviousWeek(sundayOfCurrentWeek);
    var table;
    document.body.removeChild(document.getElementById('calendar-id'));
    table = createCalendarView('calendar-id', previousSunday, previousSaturday);
    document.body.appendChild(table);
    addListenerToCellClick(table);
    $.ajax({
      url: '/appointments',
      data: {
        'fromDate': previousSunday,
        'toDate': previousSaturday,
      },
      type: 'get',
      cache: false,

      success: function getAppointments(data) {
        updateCalendar(table, data);
      },
    });
  });
  $('#nextButton').click(function getNextAppointments() {
    var sundayOfCurrentWeek =  parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10);
    var nextSunday = getSundayOfNextWeek(sundayOfCurrentWeek);
    var nextSaturday = getSaturdayOfNextWeek(sundayOfCurrentWeek);
    var table;
    document.body.removeChild(document.getElementById('calendar-id'));
    table = createCalendarView('calendar-id', nextSunday, nextSaturday);
    document.body.appendChild(table);
    addListenerToCellClick(table);
    $.ajax({
      url: '/appointments',
      data: {
        'fromDate': nextSunday,
        'toDate': nextSaturday,
      },
      type: 'get',
      cache: false,
      success: function getAppointments(data) {
        updateCalendar(table, data);
      },

    });
  });
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

// function to display the table
function displayCalendar() {
  var table;
  createPrevAndNextLinks();
  if (document.getElementById('calendar-id') !== null && document.getElementById('calendar-id').dataset.sundayepochtime !== undefined) {
    table = createCalendarView('calendar-id', document.getElementById('calendar-id').dataset.sundayepochtime);
    getScheduleAndupdateCalendar(table, parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10), getSaturdayOfCurrentWeek(new Date(parseInt(document.getElementById('calendar-id').dataset.sundayepochtime, 10))));
  } else {
    table = createCalendarView('calendar-id', getSundayOfCurrentWeek(new Date()));
    getScheduleAndupdateCalendar(table, getSundayOfCurrentWeek(new Date()), getSaturdayOfCurrentWeek(new Date()));
  }
  document.body.appendChild(table);
  addListenerToCellClick(table);
}

displayCalendar();
