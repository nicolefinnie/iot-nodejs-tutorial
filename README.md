If you're like me and don't want to maintain a web server yourself but would 
rather receive your sensor data from Raspberry Pis and control your sensors 
via the Internet, a Cloud service might come to mind. This is an example 
of hooking up a PIR motion sensor on a Raspberry Pi with IBM IoT platform on 
Bluemix. 

This basic tutorial is composed of two parts:

1) device scripts in python: reads data from a motion sensor on Raspberry Pi 
and publishes motion events to IBM IoT platform.

2) Web Application in Node.JS, Express.JS, and Angular.JS: subscribes to 
Raspberry Pi for motion sensor data, implements REST APIs and renders the sensor 
data in the view. 

For more details, check out the recipe below:

[Build an IoT Bluemix app in Node.js with sensors on Raspberry Pi](https://developer.ibm.com/recipes/tutorials/build-an-iot-bluemix-app-in-node-js-with-sensors-on-raspberry-pi/)