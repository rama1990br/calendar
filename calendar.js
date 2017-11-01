function myTable() {
    var table = document.createElement('table');
    document.body.appendChild(table);
    var thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (var k = 0; k < 7; k++) {
        var th = document.createElement('th');
        th.innerText = thElements[k];
        table.appendChild(th);
    }
    for (var i = 0; i < 24; i++) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j = 0; j < 7; j++) {

            var td = document.createElement('td');
            td.innerText = "meeting with hrishi";
            tr.appendChild(td);
        }
    }
}
myTable();