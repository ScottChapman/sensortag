var temp = 55.5;
var humidity = 65.5;
var rate = 5/100; // percent
var mqtt = require("mqtt");
var client = mqtt.connect('mqtt://raspberrypi');
client.on('connect', function() {
	setInterval(function() {
	  temp = generate(temp);
	  humidity = generate(humidity);
	  var date = new Date;
	  var data = {
	    timestamp: date.toString(),
	    temperature: temp,
	    humidity: humidity
	  }
	  console.dir(data);
	  client.publish("test/environment",JSON.stringify(data));
	},1000);

});

var generate = function(num)
{
  var drift = rate * num/2;
  var tmp = (Math.random() * drift * 2) - drift + num;
  console.log("Number was " + num + "; tmp = " + tmp);
  return (Math.round(tmp*100)/100);
}

