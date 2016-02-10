var express = require('express');
var tags = require('../models/tags')();
var router = express.Router();
var async = require('async');
var _ = require("lodash");

tags.discover(function(err) { 
    console.log("All tags enabled!");
});

/* GET SensorTag Listing. */
router.get('/sensortags/list', function(req, res, next) {
    console.dir(allTags);
  res.send(JSON.stringify(_.mapValues(allTags,'name')));
});

/* . */
router.get('/sensortag/:address/temp', function(req, res, next) {
    var sensor= tags.tag(req.params.address);
    sensor.readTemp(function (err,data) {
        res.json(data);
    });
});

router.get('/sensortag/:address/humidity', function(req, res, next) {
    var sensor= tags.tag(req.params.address);
    sensor.readHumidity(function (err,data) {
        res.json(data);
    });
});

router.get('/sensortag/:address/all', function(req, res, next) {
    var sensor= tags.tag(req.params.address);
    async.parallel([
        function(callback) {
            sensor.readHumidity(function (err,data) {
                callback(null, data);
            });
        },
        function(callback) {
            sensor.readTemp(function (err,data) {
                callback(null, data);
            });
        }
        ], 
        function (err,data) {
            var ret = {};
            data.forEach(function(datum) {
                _.merge(ret,datum);
            });
            res.json(ret);
    });
});

router.get('/sensortag/submit', function(req,res,next) {
    console.dir(req.query);
    res.json(req.query);
});
module.exports = router;
