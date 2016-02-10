var SensorTag = require('sensortag');
var _ = require("lodash");
var convert = require("convert-units");
var async = require("async");

function MySensorTag(address) {
    if (!(this instanceof MySensorTag)) {
        return new MySensorTag(address);
    }
    if (typeof address === "string")
        this.address = address;
    else
        this.sensor = address;
    return this;
};

MySensorTag.prototype.enable = function(callback) {
    var me = this;
    async.series([
      function(cb) {
        console.log('enableIrTemperature');
        me.sensor.enableIrTemperature(cb);
      },
      function(cb) {
        console.log('enableHumidity');
        me.sensor.enableHumidity(cb);
      },
      function(cb) {
        setTimeout(cb, 2000);
      }], callback);
};

MySensorTag.prototype.onConnect = function(callback) {
  var sensorTag = this.sensor;
  var me = this;

  async.series([
      function(cb) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(function() {
            console.log('Connected and Setup!');
            me.address = sensorTag.address;
            cb();
        });
      },
      function(cb) {
        console.log('readDeviceName');
        sensorTag.readDeviceName(function(error, deviceName) {
          console.log('\tdevice name = ' + deviceName);
          me.name = deviceName;
          cb();
        });
      },
      function(cb) {
        console.log('readSystemId');
        sensorTag.readSystemId(function(error, systemId) {
          console.log('\tsystem id = ' + systemId);
          cb();
        });
      },
      function(cb) {
        console.log('readSerialNumber');
        sensorTag.readSerialNumber(function(error, serialNumber) {
          console.log('\tserial number = ' + serialNumber);
          cb();
        });
      },
      function(cb) {
        console.log('readFirmwareRevision');
        sensorTag.readFirmwareRevision(function(error, firmwareRevision) {
          console.log('\tfirmware revision = ' + firmwareRevision);
          cb();
        });
      },
      function(cb) {
        console.log('readHardwareRevision');
        sensorTag.readHardwareRevision(function(error, hardwareRevision) {
          console.log('\thardware revision = ' + hardwareRevision);
          cb();
        });
      },
      function(cb) {
        console.log('readSoftwareRevision');
        sensorTag.readHardwareRevision(function(error, softwareRevision) {
          console.log('\tsoftware revision = ' + softwareRevision);
          cb();
        });
      },
      function(cb) {
        console.log('readManufacturerName');
        sensorTag.readManufacturerName(function(error, manufacturerName) {
          console.log('\tmanufacturer name = ' + manufacturerName);
          cb();
        });
      }]
       ,callback);
};

MySensorTag.prototype.connect = function(callback) {
    if (typeof this.sensor === "undefined") {
        SensorTag.discoverByAddress(this.address,function(sensorTag) {
          console.log('discovered: ' + sensorTag);
          this.sensor = sensorTag;
          return this.onConnect(callback);
        });
    }
    return this.onConnect(callback);
}

MySensorTag.prototype.readTemp = function(callback) {
    this.sensor.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
         objectTemperature = convert(objectTemperature).from('C').to('F');
         ambientTemperature = convert(ambientTemperature).from('C').to('F');
         callback(null,{
             temp: objectTemperature.toFixed(1),
             ambientTemp: ambientTemperature.toFixed(1)
         });
   });
};

MySensorTag.prototype.readHumidity = function(callback) {
   this.sensor.readHumidity(function(error, humidity) {
         callback(null,{
             humidity: humidity.toFixed(1)
         });
   });
};

module.exports = MySensorTag;
