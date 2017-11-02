//function to display the table
function myTable() {
    var table = document.createElement('table'); 
    var thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //function to display the days of the week as the header
    for (var k = 0; k < 7; k++) {
        var th = document.createElement('th');
        th.innerText = thElements[k];
        table.appendChild(th);
    }
    //function to display hourly blocks of each day for one week
    for (var i = 0; i < 24; i++) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j = 0; j < 7; j++) {

            var td = document.createElement('td');
            td.innerText = "meeting with hrishi";
            tr.appendChild(td);
        }
    }
    document.body.appendChild(table);
}
myTable();