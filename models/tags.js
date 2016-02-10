var tag = require('./tag');
var SensorTag = require('sensortag');
var _ = require("lodash");
var async = require("async");
var allTags = {};

var IDs = {
    'b0b448bfc704': 2,
    'b0b448bfd081': 1
} ;

function MySensorTags(address) {
    if (!(this instanceof MySensorTags)) {
        return new MySensorTags(address);
    }
    this.address = address;
    return this;
};

MySensorTags.prototype.discover = function(callback) {
    Object.keys(IDs).forEach(function(id) {
        var num = IDs[id];
        console.log("Looking for: " + id + " #" + num);
        SensorTag.discoverById(id,function(discoveredTag) {
            console.log("Discovered: ");
            var newTag = tag(discoveredTag);
            IDs[id] = newTag;
            newTag.number = num;
            newTag.connect(function() {
                console.log("Connected to: " + newTag.address);
                console.dir(newTag);
                newTag.enable(function() {
                    console.log("Tag enabled!");
                });
            });
        });
    });
    // async.forEachOf(addresses, function(num,address, cb) {
        // console.log("Looking for: " + address + " #" + num);
        // SensorTag.discoverByAddress(address,function(discoveredTag) {
            // var newTag = tag(discoveredTag);
            // allTags[address] = newTag;
            // newTag.number = num;
            // console.log("Discovered: ");
            // console.dir(newTag);
            // newTag.connect(function() {
                // console.log("Connected to: " + newTag.address);
                // console.dir(newTag);
                // newTag.enable(function() {
                    // console.log("Tag enabled!");
                    // cb();
                // });
            // });
        // });
    // }, function(err) {
        // callback(err);
    // });
};

MySensorTags.prototype.allTags = allTags;
MySensorTags.prototype.tag = function(addr) {
    // var key= _.findKey(allTags,{address: addr});
    return allTags[addr];
};

module.exports = MySensorTags;
