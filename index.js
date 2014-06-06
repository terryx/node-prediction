var main = require('./main');
var redis, redisClient, cluster, _;
_ = require('lodash');
redis = require('redis');
cluster = require('cluster');
redisClient = redis.createClient();

var self = main;
self.predict("SELECT * FROM location").then(function (data) {
    var result = self.getHighestDemand(data);
    self.getResource(result);


    _.each(data, function (row) {
        console.log("There are " + row.demand + " demand in " + row.name + " area");
    });

    redisClient.get("predictions", function (e, value) {
        console.log("-------------------");
        console.log("Urgent demand in " + value);
        process.kill();
    });


});