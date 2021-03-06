var http = require('http');
var url  = require('url');
//var fs = require('fs');

function textHandler(request, response) {
  console.log('received a request from ' + request.headers.host);
  console.log('resource requested: ' + request.url);
  
  response.writeHead(200, { 'Content-Type' : 'text/plain' });

  response.write('hello: ' + request.headers.host + '\n');
  response.write('  --> you requested ' + request.url);
  response.end();
}

function jsonHandler(request, response) {
  response.writeHead(200, { 'Content-Type' : 'text/json' });

  var obj = {
    host: request.headers.host,
    url : request.url
  };

  json = JSON.stringify(obj);
  response.write(json);
  response.end();
}

function csvHandler(request, response){
  response.writeHead(200, {'Content-Type' : 'text/json'});

  var fs = require('fs');

  var obj = {
    host: request.headers.host,
    url : request.url
  };

  fs.readFile('user.csv', 'utf8', function(err, data){ 

  if(err) throw err;

  var csvArr = data.split('\n');

  var userProps = csvArr[0].split(', ');

  var userArr = new Array();

  for(var i = 1; i < csvArr.length; i++){
    var userData = csvArr[i].split(', ');
    var user = {};
    for(var j = 0; j < userProps.length; j++){
      user[userProps[j]] = userData[j];
    }
    userArr.push(user);
  }
  var json = JSON.stringify(userArr);
  response.write(json);
  response.end();
});
}

if (process.argv.length < 3) {
  console.log('usage: node http-server.js [text|json|csv]');
  process.exit(1);
}

var handlerType = process.argv[2];
if (!(handlerType === 'text' || handlerType === 'json' || handlerType === 'csv')) {
  console.log('usage: node http-server.js [text|json]');
  process.exit(1);  
}

var server = null;

switch (handlerType) {
  case 'text':
    server = http.createServer(textHandler);
    break;
  case 'json':
    server = http.createServer(jsonHandler);
    break;
  case 'csv':
    server = http.createServer(csvHandler);
    console.log('Awaiting a request for a csv file!');
    break;
  default:
    throw new Error('invalid handler type!');
}

server.listen(4000);
console.log('Server is listening!');
