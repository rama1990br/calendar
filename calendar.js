//function to display the table
function myTable() {
    var table = document.createElement('table'); 
    table.id = "tableId";
    var thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //function to display the days of the week as the header
    for (var k = 0; k < 7; k++) {
        var th = document.createElement('th');
        th.innerText = thElements[k];
        table.appendChild(th);
    }
    //function to display hourly blocks of each day for one week
    getScheduleAndUpdateTable(table);
    
    document.body.appendChild(table);
}
myTable();

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
                time[i] = item.time.length;
            });
            updateTable(table, time);
        }
    });
}

function updateTable(table,time)
{
    for (var i = 0; i < 24; i++) {

        var tr = document.createElement('tr');
        table.appendChild(tr);

        for (var j = 0; j < 7; j++) {
            if (time[j] == 0) {
                var td = document.createElement('td');
                td.innerText = "";
                tr.appendChild(td);
            }
            else {
                var td = document.createElement('td');
                td.innerText = "meeting with hrishi";
                tr.appendChild(td);
            }

        }
    }
}