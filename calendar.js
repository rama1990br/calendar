//function to display the table
function myTable() {
    var table = document.createElement('table'); 
    table.id = "tableId";
    var thElements = ['Hour of day','Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //function to display the days of the week as the header
    for (var k = 0; k < 8; k++) {
        var th = document.createElement('th');
        th.innerText = thElements[k];
        table.appendChild(th);
    }
    //function to display appointments for 1 week
    getScheduleAndUpdateTable(table);
    
    document.body.appendChild(table);
}
myTable();
//function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table)
{
    var time = [];
    $.ajax({
        url: 'calendar.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function (data) {
            $.each(data, function (i, item) {
                time[i] = item.time;
             });
            updateTable(table, time);
        }
    });
}
//function to update the table according to the booked appointments
function updateTable(table,time)
{
    for (var i = 0; i < 24; i++)
    {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td = document.createElement('td');
        td.innerText = i+":00";
        tr.appendChild(td);
        for (var j = 0; j < 7; j++)
        {
            var td = document.createElement('td');
            if (time[j].length == 0)
            {
                updateCellWithNoAppointment(td);
                
            }
            else
            {
                var hourMatchFlag=0;
                for (var k = 0; k < time[j].length; k++)
                {
                    if (time[j][k] == i)
                    {
                        updateCellWithAppointment(td);
                        hourMatchFlag = 1;
                        break;
                    }
                }
                if (hourMatchFlag == 0)
                {
                    updateCellWithNoAppointment(td);
                } 
                    
            }
            tr.appendChild(td);   
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
