//function to display the table
function displayCalendar() {

    createPrevAndNextLinks();
    if(document.getElementById('calendar-id') != null && document.getElementById('calendar-id').dataset.sundayepochtime != undefined){
        var table = createCalendarView('calendar-id', document.getElementById('calendar-id').dataset.sundayepochtime);
    }
    else{
     var table = createCalendarView('calendar-id', getSundayOfCurrentWeekInEpoch(new Date()));   
    }
    getScheduleAndUpdateTable(table, getSundayOfCurrentWeekInEpoch(new Date()), getSaturdayOfCurrentWeekInEpoch(new Date()));
    document.body.appendChild(table);
}

displayCalendar();

function createPrevAndNextLinks() {
    
    function createButton(buttonId, buttonText, appendChildTo){
        var button = document.createElement('button');
        button.id = buttonId;
        button.innerHTML = buttonText;
        appendChildTo.appendChild(button);
    }

  createButton('prevButton','<', document.body);
  createButton('nextButton','>', document.body);
}

$('#prevButton').click(function() {
    var sundayOfCurrentWeekInEpoch =  document.getElementById('0Sunday').dataset.sundayepochtime;
    var previousSunday = getSundayOfPreviousWeekInEpoch(sundayOfCurrentWeekInEpoch);;
    var previousSaturday = getSaturdayOfPreviousWeekInEpoch(sundayOfCurrentWeekInEpoch);
    $.ajax({
        url: '/appointments',
        data: { 
        "fromDate": previousSunday, 
        "toDate": previousSaturday
        },
        type: 'get',
        cache: false,
        success: function (data) {
            document.body.removeChild(document.getElementById('calendar-id'));
            var table = createCalendarView('calendar-id', previousSunday, previousSaturday);
            updateTable(table, data);
            document.body.appendChild(table);
        }   
    });
});

$('#nextButton').click(function() {
    var sundayOfCurrentWeekInEpoch =  document.getElementById('0Sunday').dataset.sundayepochtime;
    var nextSunday = getSundayOfPreviousWeekInEpoch(sundayOfCurrentWeekInEpoch);
    var nextSaturday = getSaturdayOfNextWeekInEpoch(sundayOfCurrentWeekInEpoch);
    $.ajax({
        url: '/appointments',
        data: { 
        "fromDate": nextSunday, 
        "toDate": nextSaturday
        },
        type: 'get',
        cache: false,
        success: function (data) {
            document.body.removeChild(document.getElementById('calendar-id'));
            var table = createCalendarView('calendar-id', nextSunday, nextSaturday);
            updateTable(table, data);
            document.body.appendChild(table);
        }   
    });
});


$("#calendar-id").on('click', 'td', displayModal);

//cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is 
//encountered in the displayModal method and therefore is called multiple times on each cancel button click. 
function cancelModal() {
    $("#favDialog")[0].close();
}

function confirmModal(event) {
    var epochStartTimeOfEvent = getSelectedDateInCurrentWeekInEpoch(new Date(), event.data.clickedColumnIndex, $("#startTime option:selected").text());
    var epochEndTimeOfEvent = getSelectedDateInCurrentWeekInEpoch(new Date(), event.data.clickedColumnIndex, $("#endTime option:selected").text());
    var sendInfo = {
        eventName: $("#eventName").val(),
        startTime: epochStartTimeOfEvent,
        endTime: epochEndTimeOfEvent,
        locationName: $("#locationName").val()
    };

    $.ajax({
        url: '/',
        method: 'POST',
        data: JSON.stringify(sendInfo),
        cache: false,
        success: function (data) {
            console.log("done!");
        }
    });
    displayCalendar();
}

function displayModal() {
    var selectedStartTime = $('td:first', $(this).parents('tr')).text();
    var clickedColumnIndex;
    $('#favDialog')[0].showModal(); //showModal function can be applied only to a HTMLDialogMethod and not to a jQuery object, therefore $("#favDialog")[0]
    $("#startTime option").each(function() {   
        if(selectedStartTime === $(this).val()) {
            $("#" + $(this).attr('id')).attr("selected","selected");
            return false;
        }
    });

    // Form cancel button closes the dialog box
    $("#cancel").click(cancelModal); 
    $("#confirm").click({clickedColumnIndex: parseInt( $(this).index() - 1)}, confirmModal);
}

//function to create the skeleton of the calendar
function createCalendarView(id, fromDateInEpoch) {
    function createTableHeader(day, i) {
        th = document.createElement('th');
        th.id = i + day;
        th.innerText = day;
        table.appendChild(th);
    }

    var table, 
      thElements, 
      k, 
      th, 
      i, 
      tr, 
      td, 
      j,
      startOfWeekDate,
      dayOfWeek;
    table = document.createElement('table');
    table.id = id;
    table.dataset.sundayepochtime = fromDateInEpoch;
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
        td.innerText = i + ":00";
        tr.appendChild(td);
        thElements.forEach(createTableCells);
    }

    function createTableCells(day, j) {
            td = document.createElement('td');
            td.id = day + i;
            tr.appendChild(td);
    }

    return table;
}
//function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table, fromDateInEpoch, toDateInEpoch) {

    $.ajax({
        url: '/appointments',
        data: { 
        "fromDate": fromDateInEpoch, 
        "toDate": toDateInEpoch
        },
        type: 'get',
        cache: false,
        success: function (data) {
            updateTable(table, data);
        }   
    });
}

//function to update the table according to the booked appointments
function updateTable(table, data) {
    var locale = 'en-US',
      eventName, 
      startRow, 
      startTimeDay, 
      locationName, 
      startTimeHour, 
      endTimeHour;
    $.each(data, function (i, item) {
        eventName = item.eventName;
        locationName = item.locationName;
        startTimeDay = getDayOfWeekInShortStringFormatFromEpoch(item.startTime, locale);
        startTimeHour = getHourFromEpoch(item.startTime);
        endTimeHour = getHourFromEpoch(item.endTime);
        startRow = document.getElementById(startTimeHour);
        numberOfHours = endTimeHour - startTimeHour;
        $.each(startRow.childNodes, function(j, item) {
            if(item.id.includes(startTimeDay)) {
                $("#" + item.id).attr('rowspan',endTimeHour - startTimeHour + 1);
                $("#" + item.id).text(eventName + " at " + locationName);
            }
        });
    });
}


