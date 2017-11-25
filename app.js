var http = require('http');
var fs = require('fs');
var path = require('path')
const PORT = 3000;
http.createServer(function (request, response) {
    var filePath = request.url === '/' ? 'index.html' : request.url;
    var extName;
    function getContentType(extName) {
        switch (extName) {
            case 'css': return 'text/css';
            case 'json': return 'application/json';
            case 'js': return 'application/javascript';
            default: return "text/html";
        }
    }

    if (filePath.includes('?')) {
        extName = filePath.split('?')[0].split('.')[1];
    }
    else {
        extName = filePath.split('.')[1];
    }        
    fs.readFile('./' + filePath.split('?')[0], function (error, content) {
       if (error) {
                throw error;
            }
            else {
                response.writeHead(200, { 'Content-Type': getContentType(extName) });
                response.end(content, 'utf-8');
            }
        });

   
    }


).listen(3000);


