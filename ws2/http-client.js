var url = require('url');
var http = require('http');

if (process.argv.length < 3) {
  console.log('usage: node http-client.js [h|rh|json] [url]');
  process.exit(1);
}

// The handler function to invoke:
var handlerType = process.argv[2];

// The url to connect to:
var urlStr = process.argv[3] || 'http://www-edlab.cs.umass.edu/cs326/schedule/';

if (!(handlerType === 'h' || handlerType === 'rh' || handlerType === 'json' || handlerType === 'csv' || handlerType === 're-csv')) {
  console.log('usage: node http-client.js [h|rh|json|csv|re-csv] [url]');
  process.exit(1);  
}

var url = url.parse(urlStr);

var options = {
    host: url.hostname,
    path: url.path,
    port: url.port || 80,
    method: 'GET'
  };

/**
 * A function to create a response handler.
 */
function createResponseHandler (callback) {
  /**
   * A function to handle a response.
   */
  function responseHandler(res) {
    // A variable to capture the data from the response:
    var str = '';

    // When data is received we append to string.
    res.on('data', function (chunk) {
      str += chunk;
    });

    // When the connection is closed, we invoke our callback.
    res.on('end', function () {
      callback(str);
    });
  }

  // Return the created function:
  return responseHandler;
}

// Create a basic handler:
var handler = createResponseHandler(function (data) {
  console.log(data);
});

// A slightly more interesting handler:
var re_handler = createResponseHandler(function (data) {
  var lines = data.split("\n");

  console.log('Found Links:');
  var re = /<a +href="([^"]+)".*>/; // <a href="URL">link text</a>
  lines.forEach(function (line) {
    var match = re.exec(line);

    if (match !== null) {
      console.log(match[1]);
    }
  });
});

// Even more interesting:
var json_handler = createResponseHandler(function (data) {
  var obj = JSON.parse(data);
  console.log(obj);
});

var csv_handler = createResponseHandler(function (data) {
  var userArr = JSON.parse(data);
  for(var i = 0; i < userArr.length; i++){
    var props = Object.keys(userArr[i]);
    var user = userArr[i];
    for(var j = 0; j < props.length; j++){
      console.log(props[j]+': '+user[props[j]]);
    }
    console.log('----------------------------------------');
  }
});

var re_csv_handler = createResponseHandler(function (data){
  var userArr = JSON.parse(data);
  var props = Object.keys(userArr[0]);
  var propString= '';
  for(var i = 0; i < props.length; i++){
    propString = (propString + props[i] + ', ');
  }
  console.log(propString);
  for(var j = 0; j < userArr.length; j++){
    var user = userArr[j];
    var userString ='';
    for(var k = 0; k < props.length; k++){
      if(k === props.length-1){
        userString = (userString + user[props[k]]);
      }
      else{
        userString = (userString + user[props[k]] + ', ');
      }
    }
    console.log(userString);
  }
});



console.log(' --> connecting to ' + options.host + ' on port ' + options.port);
console.log(' --> resource ' + options.path);

switch (handlerType) {
  case 'h':
    var req = http.request(options, handler);
    req.end();
    break;
  case 'rh':
    var req = http.request(options, re_handler);
    req.end();
    break;
  case 'json':
    var req = http.request(options, json_handler);
    req.end();
    break;
  case 'csv':
    var req = http.request(options, csv_handler);
    req.end();
    break;
  case're-csv':
    var req = http.request(options, re_csv_handler);
    req.end();
    break;  
  default:
    console.log('unknown handler type');
}


