//function to display the table
function myTable() {
    var table=createTable();
    getScheduleAndUpdateTable(table);
    document.body.appendChild(table);
}
myTable();

//function to create the skeleton of the calendar
function createTable()
{
    var table = document.createElement('table');
    table.id = "tableId";
    var thElements = ['Hour of day', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (var k = 0; k < 8; k++) {
        var th = document.createElement('th');
        th.innerText = thElements[k];
        table.appendChild(th);
    }
    for (var i = 0; i < 24; i++) {
        var tr = document.createElement('tr');
        tr.id = i;
        table.appendChild(tr);
        var td = document.createElement('td');
        td.innerText = i + ":00";
        tr.appendChild(td);
        
        for (var j = 1; j < 8; j++) {
            var td = document.createElement('td');
            updateCellWithNoAppointment(td);
            tr.appendChild(td);
        }


    }
    return table;
}
//function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table)
{
    var time = [];
    $.ajax({
        url: '/App_Data/calendar.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function (data) {
            $.each(data, function (i, item) {
                time[i] = item.time;
            });
            updateTable(table,time);
        }
    });
}
//function to update the table according to the booked appointments
function updateTable(table,time)
{
    for (var i = 0; i < 24; i++)
    {
        var tr = document.getElementById(i);
        for (var j = 0; j<7; j++)
        {
            var td = tr.getElementsByTagName('td');
            
            if (time[j].length == 0)
            {
                updateCellWithNoAppointment(td[j+1]);
                
            }
            else
            {
                var hourMatchFlag=0;
                for (var k = 0; k < time[j].length; k++)
                {
                    if (time[j][k] == i)
                    {
                        updateCellWithAppointment(td[j+1]);
                        hourMatchFlag = 1;
                        break;
                    }
                }
                if (hourMatchFlag == 0)
                {
                    updateCellWithNoAppointment(td[j+1]);
                } 
                    
            }
        }

    }
}
//function to display an empty cell in case of no booked appointment
function updateCellWithNoAppointment(td)
{
    td.innerText = "";
}
//function to display the booked appointment
function updateCellWithAppointment(td)
{
    td.innerText = "meeting with hrishi";
}
