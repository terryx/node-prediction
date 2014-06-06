(function () {

    "use strict";

    var mysql, Promise, EventEmitter, fs, _, redis, redisClient;
    _ = require('lodash');
    Promise = require('bluebird');
    fs = Promise.promisifyAll(require("fs"));
    mysql = require('mysql');
    redis = require('redis');
    redisClient = redis.createClient();


    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'prediction'
    });

    exports.getConnection = function () {
        var deferred = Promise.defer();

        connection.connect();

        return deferred.promise;
    };

    exports.getQuery = function (sql) {
        var deferred = Promise.defer();

        connection.query(sql, function (err, rows) {
            deferred.resolve(rows);

        });
        return deferred.promise;
    };

    exports.predict = function (query) {
        var deferred = Promise.defer();
        this.getQuery(query)
            .then(function (data) {
                if (!_.isArray(data)) {
                    throw "Invalid data";
                }

                _.each(data, function (row, i) {
                    if (row.demand) {

                        row.demand = parseInt(row.demand, 10);

                        data[i].demand = Math.floor((Math.random() * 1000) + 1);
                    }
                });
                deferred.resolve(data);
            });

        return deferred.promise;
    };

    exports.getHighestDemand = function (resource) {
        var result = {};

        _.each(resource, function (row, i) {
            if (_.isEmpty(result)) {
                result = resource[i];
            }

            if (result.demand < resource[i].demand) {
                result = resource[i];
            }
        });

        return result;
    };

    exports.getResource = function (resource) {
        redisClient.set('predictions', resource.name);
    };

}).call(this);
