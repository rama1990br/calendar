const INSERT_QUERY = 'INSERT INTO dummyTable SET ?';
const SELECT_QUERY = 'SELECT * FROM dummyTable';

var methods = {};
	
methods.addEvent = function(con, data, callbackfn) {
  con.query(INSERT_QUERY, data, callbackfn);
}

methods.retrieveEvent = function(con, callbackfn) {
  con.query(SELECT_QUERY, callbackfn);
}

methods.retrieveWeeklyEvent = function(con, query, callbackfn) {
  con.query('SELECT * FROM dummyTable where startTime between '+query.fromDate+' AND '+query.toDate, callbackfn);
}

 exports.data = methods;