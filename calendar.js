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
function cancelModal(){
    $("#favDialog")[0].close();
}

function confirmModal(event){

    var sendInfo = {
           eventName: $("#eventName").val(),
           startTime: $("#startTime option:selected").text() + event.data.param1,
           endTime: $("#endTime option:selected").text() + event.data.param1, 
           locationName: $("#locationName").val()
       };

    // var userData = $("#eventName").val() + " " + $("#locationName").val();
    $.ajax({
        url: './',
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
 var startTime = this.parentNode.innerText;

  $("#favDialog")[0].showModal(); //showModal function can be applied only to a HTMLDialogMethod and not to a jQuery object, therefore $("#favDialog")[0]
  
 
  $("#startTime option").each(function() {   
        if(startTime.includes(this.value)){
            $("#"+this.id).attr("selected","selected");
        }
  });
  // Form cancel button closes the dialog box
  $("#cancel").click(cancelModal); 
var param1;
 $("#confirm").click({param1: this.id}, confirmModal);
}


//function to create the skeleton of the calendar
function createTable() {
    var table = document.createElement('table');
    table.id = "calendar-id";
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
        td.id="hour"+i;
        td.innerText = i + ":00";
        tr.appendChild(td);

        for (var j = 1; j < 8; j++) {
            var td = document.createElement('td');
            switch(j)
            {
                case 1: td.id="sunday"+i;
                        break;
                case 2: td.id="monday"+i;
                        break;

                case 3: td.id="tuesday"+i;
                        break;
                case 4: td.id="wednesday"+i;
                        break;
                case 5: td.id="thursday"+i;
                        break;
                case 6: td.id="friday"+i;
                        break;
                case 7: td.id="saturday"+i;
                        break;


            }
            updateCellWithNoAppointment(td);
            tr.appendChild(td);
        }
    }
    return table;
}
//function which makes an ajax call to get the values from the json file which contains the hours for which appointments have been booked
function getScheduleAndUpdateTable(table) {
    var eventname=[];
    var starttime = [];
    var endtime=[];
    var locationname=[];
    $.ajax({
        url: '/getJSONResponse',
        type: 'get',
        cache: false,
        success: function (data) {
            $.each(data, function (i, item) {
                eventname[i]=item.eventName;
                starttime[i] = item.startTime;
                endtime[i]= item.endTime;
                locationname[i]=item.locationName;
            });
            updateTable(table,eventname, starttime,endtime,locationname);
        }
    });
}
//function to update the table according to the booked appointments
function updateTable(table, eventname, starttime, endtime, locationname) {
    for(var i=0;i<starttime.length;i++){
        var startTimeHour=starttime[i].split(':')[0];
        var startTimeDay=starttime[i].split(':')[1].substring(2);
        var endTimeEvent=endtime[i].split(':')[0];
        var endTimeDay=endtime[i].split(':')[1].substring(2);

        var startRow=document.getElementById(starttime[i].split(':')[0]);
        var endRow=document.getElementById(endtime[i].split(':')[0]);

        for(var j=0;j<8;j++){
            if(startRow.childNodes[j].id.includes(startTimeDay)){
                //var startCell=document.getElementById(startTimeDay+starttime[i].substring(0,1));
                //startCell.attr('rowspan',endtime[i].substring(0,1)-starttime[i].substring(0,1));
                $("#"+startTimeDay).attr('rowspan',endtime[i].split(':')[0]-starttime[i].split(':')[0]+1);
                $("#"+startTimeDay).text(eventname[i]+" at "+locationname[i]);
            }
        }

    }
    // for (var i = 0; i < 24; i++) {
    //     var tr = document.getElementById(i);
    //     if(starttime.includes(tr.childNodes[0].innerText)){

    //     }
    //     for (var j = 0; j < 7; j++) {
    //         var td = tr.getElementsByTagName('td');

    //         if (starttime[j] === null) {
    //             updateCellWithNoAppointment(td[j + 1]);
    //         }
    //         // else {
    //         //     var hourMatchFlag = 0;
    //         //     for (var k = 0; k < time[j].length; k++) {
    //         //         if (time[j][k] == i) {
    //         //             updateCellWithAppointment(td[j + 1]);
    //         //             hourMatchFlag = 1;
    //         //             break;
    //         //         }
    //         //     }
    //         //     if (hourMatchFlag == 0) {
    //         //         updateCellWithNoAppointment(td[j + 1]);
    //         //     }

    //         // }
    //     }

    // }
}
//function to display an empty cell in case of no booked appointment
function updateCellWithNoAppointment(td) {
    td.innerText = "";
}
//function to display the booked appointment
function updateCellWithAppointment(td) {
    td.innerText = "meeting with hrishi";
}
