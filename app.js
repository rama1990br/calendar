var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var db = require('./db_functions.js');
var PORT = 3000;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'custom',
  password: 'password',
  database: 'calendar_db'});

function dbCallbackAddEvent(err, result) {
  if (err) {
    throw err;
  }
  // console.log("1 record inserted");
}

function dbCallbackDeleteEvent(err, result) {
  if (err) {
    throw err;
  }
  // console.log("1 record deleted");
}

function dbCallbackWeeklyRetrieveEvent(err, rows) {
  if (err) {
    throw err;
  }
  // console.log('Weekly data received from Db:\n' + rows);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(rows), 'utf-8');
}

http.createServer(function processRequest(request, response) {
  var body = '';
  var filePath = request.url === '/' ? 'index.html' : request.url;
  var extName;
  var query;
  if (request.url === '/favicon.ico') {           // code to handle favicon.ico image
    response.writeHead(200, {'Content-Type': 'image/x-icon'});
    response.end();
    return;
  }
  if (request.method === 'POST' && request.url === '/') {
    request.on('data', function addEvent(data) {
      body = JSON.parse(data);
      if (body.length > 1e6) {
        request.connection.destroy();
      }
      db.data.addEvent(con, body, dbCallbackAddEvent);
    });
  }
  if (request.method === 'POST' && request.url === '/deleteAppointment') {
    request.on('data', function deleteEvent(data) {
      body = JSON.parse(data);
      if (body.length > 1e6) {
        request.connection.destroy();
      }
      db.data.deleteEvent(con, body, dbCallbackDeleteEvent);
    });
  }

  function getContentType() {
    switch (extName) {
    case 'css': return 'text/css';
    case 'json': return 'application/json';
    case 'js': return 'application/javascript';
    default: return 'text/html';
    }
  }

  if (filePath.includes('?')) {
    extName = filePath.split('?')[0].split('.')[1];
  } else {
    extName = filePath.split('.')[1];
  }
  if (request.url.includes('/appointments')) {
    query = require('url').parse(request.url, true).query;
    db.data.retrieveWeeklyEvent(con, query, dbCallbackWeeklyRetrieveEvent);
  } else {
    fs.readFile('./' + filePath.split('?')[0], function readContents(error, content) {
      if (error) {
        throw error;
      } else {
        response.writeHead(200, { 'Content-Type': getContentType(extName) });
        response.end(content, 'utf-8');
      }
    });
  }
}).listen(3000);


