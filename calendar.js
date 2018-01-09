//function to display the table
function myTable() {
    var table = createTable();
    getScheduleAndUpdateTable(table);
    document.body.appendChild(table);
    
}
myTable();
$("#calendar-id").on('click', 'td', displayModal);

//cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is 
//encountered in the displayModal method and therefore is called multiple times on each cancel button click. 
function cancelModal() {
    $("#favDialog")[0].close();
}

function getSelectedDate(todaysDate, dayOfWeekNumber) {
    var diffInNumberOfDays = todaysDate.getDay() - dayOfWeekNumber;
    todaysDate.setHours(-24 * diffInNumberOfDays);
    return todaysDate;
}
function confirmModal(event) {
    var selectedDate = getSelectedDate(new Date(), event.data.param1);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var epochStartTimeOfEvent = (new Date(monthNames[selectedDate.getMonth()] + " " + selectedDate.getDate() + ", " + selectedDate.getFullYear() + " " + $("#startTime option:selected").text() + ":00")).getTime()/1000.0;
    var epochEndTimeOfEvent = (new Date(monthNames[selectedDate.getMonth()] + " " + selectedDate.getDate() + ", " + selectedDate.getFullYear() + " " + $("#endTime option:selected").text() + ":00")).getTime()/1000.0;
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
    myTable();
}

function displayModal() {
    var selectedStartTime = this.parentNode.innerText;
    var param1;
    $('#favDialog')[0].showModal(); //showModal function can be applied only to a HTMLDialogMethod and not to a jQuery object, therefore $("#favDialog")[0]
    $("#startTime option").each(function() {   
        if(selectedStartTime.includes(this.value)) {
            $("#" + this.id).attr("selected","selected");
        }
    });
    // Form cancel button closes the dialog box
    $("#cancel").click(cancelModal); 
    $("#confirm").click({param1: parseInt( $(this).index() - 1)}, confirmModal);
}


//function to create the skeleton of the calendar
function createTable() {
    var table, thElements, k, th, i, tr, td, j;
    table = document.createElement('table');
    table.id = "calendar-id";
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
        td.innerText = i + ":00";
        tr.appendChild(td);
        thElements.forEach(function(day, j) {
            td = document.createElement('td');
            td.id = day + i;
            tr.appendChild(td);
        });
    }
    return table;
}
//function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table) {
    $.ajax({
        url: '/getjsonresponse',
        type: 'get',
        cache: false,
        success: function (data) {
            updateTable(table,data);
        }   
    });
}
//function to update the table according to the booked appointments
function updateTable(table, data) {
    var eventName, startRow, startTimeDay, locationName, startTimeHour, endTimeHour;
    $.each(data, function (i, item) {
        eventName = item.eventName;
        locationName = item.locationName;
        startTimeDay = (new Date(item.startTime * 1000)).toLocaleString('en-US', {weekday: 'short'});
        startTimeHour = (new Date(item.startTime * 1000)).toLocaleString().split(' ')[2] == 'AM' ? (new Date(item.startTime * 1000)).toLocaleString().split(' ')[1].split(':')[0] : parseInt((new Date(item.startTime * 1000)).toLocaleString().split(' ')[1].split(':')[0]) + 12;
        endTimeHour = (new Date(item.endTime * 1000)).toLocaleString().split(' ')[2] == 'AM' ? (new Date(item.endTime * 1000)).toLocaleString().split(' ')[1].split(':')[0] : parseInt((new Date(item.endTime * 1000)).toLocaleString().split(' ')[1].split(':')[0]) + 12;
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


