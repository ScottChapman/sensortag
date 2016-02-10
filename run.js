var tags = require('sensortag');
var _ = require("lodash");

// console.dir(tag1);
// tag1.connect(function() { 
    // console.log("Connected!");
    // tag1.enable(function () {
        // console.log("Enabled!");
        // tag1.monitor();
    // });
// });

tags.discoverAll(function(tag) {
    console.log("Discovered!");
    console.dir(tag);
});

