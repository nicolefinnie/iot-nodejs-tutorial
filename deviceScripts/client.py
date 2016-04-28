#!/usr/bin/python
# This is only executed on the device client e.g. Raspberry Pi
import time
import os, json
import ibmiotf.application
import uuid
import motionSensor

client = None

motionSensorGPIOPort = 4


try:
    options = ibmiotf.application.ParseConfigFile("/home/pi/device.cfg")
    options["deviceId"] = options["id"]
    options["id"] = "aaa" + options["id"]
    client = ibmiotf.application.Client(options)
    print "try to connect to IoT"
    client.connect()
    print "connect to IoT successfully"

    motionStatus = False
    motionSensor.setup(motionSensorGPIOPort)


    while True:
        motionData = motionSensor.sample()
        jsonMotionData = json.dumps(motionData)
        client.publishEvent("raspberrypi", options["deviceId"], "motionSensor", "json", jsonMotionData)

        if motionData['motionDetected'] != motionStatus:
                motionStatus = motionData['motionDetected']
                print "Change in motion detector status, motionDetected is now:", motionStatus
         
        time.sleep(0.2)
 
except ibmiotf.ConnectionException  as e:
    print e