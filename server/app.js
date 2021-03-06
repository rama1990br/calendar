var http = require('http'),
  fs = require('fs'),
  path = require('path'),
  mysql = require('mysql'),
  db = require('./db_functions.js'),
  PORT = 3000;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'custom',
  password: 'password',
  database: 'calendar_db'});

function dbCallbackAddEvent(err, result) {
  if (err) {
    throw err;
  }
  // console.log('1 record inserted');
}

function dbCallbackEditEvent(err, result) {
  if (err) {
    throw err;
  }
  // console.log('1 record edited');
}

function dbCallbackDeleteEvent(err, result) {
  if (err) {
    throw err;
  }
  // console.log('1 record deleted');
}


http.createServer(function processRequest(request, response) {
  // console.log(request.url);
  var body = '',
    filePath = request.url === '/' ? './client/index.html' : request.url,
    extName,
    query;
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
  if (request.method === 'POST' && request.url === '/editAppointment') {
    request.on('data', function editEvent(data) {
      body = JSON.parse(data);
      if (body.length > 1e6) {
        request.connection.destroy();
      }
      db.data.editEvent(con, body, dbCallbackEditEvent);
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
    fs.readFile('./client/index.html', function readContents(error, content) {
      if (error) {
        throw error;
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(content, 'utf-8');
      }
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
  function dbCallbackWeeklyRetrieveEvent(err, rows) {
    if (err) {
      throw err;
    }
    // console.log('Weekly data received from Db:\n' + rows);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(rows), 'utf-8');
  }

  if (request.url === '/monthView') {
    filePath = 'client/month-view.html';
  }
  if (request.url.includes('/dayView')) {
    filePath = 'client/day-view.html';
  }
  if (request.url.includes('/appointments')) {
    // console.log('appointments');
    query = require('url').parse(request.url, true).query;
    db.data.retrieveWeeklyEvent(con, query, dbCallbackWeeklyRetrieveEvent);
  } else if (request.url !== '/deleteAppointment' && request.url !== '/editAppointment') {
    fs.readFile('../' + filePath.split('?')[0].slice(1), function readContents(error, content) {
      if (error) {
        throw error;
      } else {
        response.writeHead(200, { 'Content-Type': getContentType(extName) });
        response.end(content, 'utf-8');
      }
    });
  }
}).listen(3000);
