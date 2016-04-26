/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// bodyp-parse helps to send http requests 
// for more info, see: https://github.com/expressjs/body-parser
var bodyParser = require('body-parser');

// IBM IoT service
var Client = require('ibmiotf').IotfApplication;

//file system library
var fs = require('fs');

// register server side express.js
var raspberryPiServer = require('./routes/raspberryPiServer');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
// define an alias of the absolute path of node_modules/ where libraries are installed
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// this iot service config 
var iotConfig;

/**
 * @attention 
 * iot-raspberrypi is the IoT platform service name in this example, you should replace it with yours
 */
var iotPlatformServiceName = 'iot-raspberrypi';

//Loop through VCAP_SERVICES defined in Bluemix and retrieve the credential from the IoT service
var baseConfig = appEnv.getServices(iotPlatformServiceName);

/**
 * Local vcap_service.json ported from VCAP_SERVICES defined as Environment Variables on your Bluemix dashboard.
 * but the vcap_service stored in Bluemix is different.
 */
if (!baseConfig || Object.keys(baseConfig).length === 0) {
  var configJSON = require('./vcap_service.json');
  configJSON["iotf-service"].forEach(function(entry) {
    if (entry.name === iotPlatformServiceName) {
      iotConfig = entry;
    }
  })  
} 
/**VCAP_SERVICES stored in Bluemix, its JSON format is different than VCAP_SERVICES. 
*/
else {
  iotConfig = baseConfig['iot-raspberrypi'];
}

console.log('iot config is ' + JSON.stringify(iotConfig));

var iotAppConfig = {
    "org" : iotConfig.credentials.org,
    "id" : iotConfig.credentials.iotCredentialsIdentifier,
    "auth-method" : "apikey",
    "auth-key" : iotConfig.credentials.apiKey,
    "auth-token" : iotConfig.credentials.apiToken
}

var appClient = new Client(iotAppConfig);

appClient.connect();
console.log("Successfully connected to our IoT service!");

// subscribe to input events 
appClient.on("connect", function () {
  console.log("subscribe to input events");
  appClient.subscribeToDeviceEvents("raspberrypi");
});

// get device events, we need to initialize this JSON doc with an attribute because it's called by reference
var otherSensor = {"payload":{}};
var myHouse = {"motionPayload":{}};

appClient.on("deviceEvent", function(deviceType, deviceId, eventType, format, payload){
  if (eventType === 'motionSensor'){
    myHouse.motionPayload = JSON.parse(payload);
  }
  else {
    console.log('Got other events of ' + eventType + ' from ' + deviceId + ':' + JSON.stringify(payload));
  } 
});

app.get('/sensordata', raspberryPiServer.returnCurrentSensorData(myHouse));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
