/*eslint-env node */

/**
 * Server side - express JS - where you should define REST APIs of the server side. 
 */
// client asks server for the sensor data, and server sends back the sensor data
exports.returnCurrentSensorData = function(sensorData){
  return function(req, res){
    res.send(sensorData);
  };
};
