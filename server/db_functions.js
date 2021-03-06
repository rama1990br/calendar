var INSERT_QUERY = 'INSERT INTO dummyTable SET ?';
var SELECT_QUERY = 'SELECT * FROM dummyTable';

var methods = {};

methods.addEvent = function addAnEvent(con, data, callbackfn) {
  con.query(INSERT_QUERY, data, callbackfn);
};

methods.editEvent = function editAnEvent(con, data, callbackfn) {
  con.query('UPDATE dummyTable set startTime = ' + data.startTime + ', endTime= ' + data.endTime + ', eventName= \'' + data.eventName + '\', locationName = \'' + data.locationName + '\' where startTime =' + data.previousEvent, callbackfn);
};

methods.deleteEvent = function deleteAnEvent(con, data, callbackfn) {
  con.query('DELETE FROM dummyTable where startTime = ' + data.startTime + ' and endTime= ' + data.endTime + ' and eventName= \'' + data.eventName + '\' and locationName = \'' + data.locationName + '\'', callbackfn);
};

methods.retrieveEvent = function retrieveAnEvent(con, callbackfn) {
  con.query(SELECT_QUERY, callbackfn);
};

methods.retrieveWeeklyEvent = function retrieveEventsOfWeek(con, query, callbackfn) {
  con.query('SELECT * FROM dummyTable where startTime between ' + query.fromDate + ' AND ' + query.toDate, callbackfn);
};

exports.data = methods;
