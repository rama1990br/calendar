const INSERT_QUERY = 'INSERT INTO dummyTable SET ?';
const SELECT_QUERY = 'SELECT * FROM dummyTable';

var methods = {};

methods.addEvent = function(con, data, callbackfn) {
  con.query(INSERT_QUERY, data, callbackfn);
}

methods.retrieveEvent = function(con, data, callbackfn) {
  con.query(SELECT_QUERY, data, callbackfn);
}
 exports.data = methods;