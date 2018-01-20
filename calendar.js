// function to display the table
function myTable() {
  var table = createTable();
  getScheduleAndUpdateTable(table);
  document.body.appendChild(table);
}
myTable();

$('#calendar-id').on('click', 'td', displayModal);

// cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is
// encountered in the displayModal method and therefore is called multiple times on each cancel button click.
function cancelModal() {
  $('#favDialog')[0].close();
}

function getSelectedDate(todaysDate, dayOfWeekNumber) {
  var NUMBER_OF_HOURS_IN_DAY = 24
  var diffInNumberOfDays = todaysDate.getDay() - dayOfWeekNumber;
  var selectedDate = todaysDate.setHours(-NUMBER_OF_HOURS_IN_DAY * diffInNumberOfDays);
  return selectedDate;
}

function formatDateTimeToEpoch(date, time) {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dateInDateTime = new Date(date);
  return new Date(monthNames[dateInDateTime.getMonth()] + ' ' + dateInDateTime.getDate() + ', ' + dateInDateTime.getFullYear() + ' ' + time + ':00').getTime() / 1000.0;
}

function confirmModal(event) {
  var selectedDate = getSelectedDate(new Date(), event.data.clickedColumnIndex);
  var epochStartTimeOfEvent = formatDateTimeToEpoch(selectedDate, $('#startTime option:selected').text());
  var epochEndTimeOfEvent = formatDateTimeToEpoch(selectedDate, $('#endTime option:selected').text());
  var sendInfo = {
    eventName: $('#eventName').val(),
    startTime: epochStartTimeOfEvent,
    endTime: epochEndTimeOfEvent,
    locationName: $('#locationName').val(),
  };

  $.ajax({
    url: '/',
    method: 'POST',
    data: JSON.stringify(sendInfo),
    cache: false,
    success: function(data) {
      console.log('done!');
    },
  });
  myTable();
}

function displayModal() {
  var selectedStartTime = $('td:first', $(this).parents('tr')).text();
  var clickedColumnIndex;
  $('#favDialog')[0].showModal(); // showModal function can be applied only to a HTMLDialogMethod and not to a jQuery object, therefore $("#favDialog")[0]
  $('#startTime option').each(function() {
    if (selectedStartTime === $(this).val()) {
      $('#' + $(this).attr('id')).attr('selected', 'selected');
      return false;
    }
  });

  // Form cancel button closes the dialog box
  $('#cancel').click(cancelModal);
  $('#confirm').click({clickedColumnIndex: parseInt( $(this).index() - 1)}, confirmModal);
}


// function to create the skevaron of the calendar
function createTable() {
  var table,
    thElements,
    k,
    th,
    i,
    tr,
    td,
    j;
  table = document.createElement('table');
  table.id = 'calendar-id';
  thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  th = document.createElement('th');
  th.innerText = 'Hour of day';
  table.appendChild(th);
  thElements.forEach(function(day, i) {
    th = document.createElement('th');
    th.id = i + day;
    th.innerText = day;
    table.appendChild(th);
  });

  for (i = 0; i < 24; i++) {
    tr = document.createElement('tr');
    tr.id = i;
    table.appendChild(tr);
    td = document.createElement('td');
    td.innerText = i + ':00';
    tr.appendChild(td);
    thElements.forEach(function(day, j) {
      td = document.createElement('td');
      td.id = day + i;
      tr.appendChild(td);
    });
  }
  return table;
}
// function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table) {
  $.ajax({
    url: '/getjsonresponse',
    type: 'get',
    cache: false,
    success: function(data) {
      updateTable(table, data);
    },
  });
}

function getEventStartDay(startTime, locale) {
  return (new Date(startTime * 1000)).toLocaleString(locale, {weekday: 'short'});
}

// function to update the table according to the booked appointments
function updateTable(table, data) {
  var locale = 'en-US',
    eventName,
    startRow,
    startTimeDay,
    locationName,
    startTimeHour,
    endTimeHour;
  $.each(data, function(i, item) {
    eventName = item.eventName;
    locationName = item.locationName;
    startTimeDay = getEventStartDay(item.startTime, locale);
    startTimeHour = (new Date(item.startTime * 1000)).getHours();
    endTimeHour = (new Date(item.endTime * 1000)).getHours();
    startRow = document.getElementById(startTimeHour);
    numberOfHours = endTimeHour - startTimeHour;
    $.each(startRow.childNodes, function(j, item) {
      if (item.id.includes(startTimeDay)) {
        $('#' + item.id).attr('rowspan', endTimeHour - startTimeHour + 1);
        $('#' + item.id).text(eventName + ' at ' + locationName);
      }
    });
  });
}
