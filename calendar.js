function myTable() {
    var table = document.createElement('table');
    table.setAttribute('id', 'myTable');
    document.body.appendChild(table);
    for (var i = 0; i < 24; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'myTr');
        document.getElementById('myTable').appendChild(tr);

        for (var j = 0; j < 7; j++) {

            var td = document.createElement('td');
            // td.appendChild(document.createTextNode('Cell'));
            document.getElementById('myTr').appendChild(td);

        }
    }
}