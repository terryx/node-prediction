(function () {
    "use strict";

    var main, should, _, redis, redisClient;
    _ = require('lodash');
    should = require('should');
    main = require('../main');
    redis = require('redis');
    redisClient = redis.createClient();

    describe('DB connection and data gathering', function () {

        var resource = {};

        it('should return connection object', function () {
            var connection = main.getConnection();
            should.exist(connection);
        });

        it('should return data as array', function (done) {
            var connection = main.getQuery('SELECT * FROM location')
                .then(function (data) {
                    data.should.be.an.Array;
                    done();
                });
        });

        it('should perform predictive demand', function (done) {
            main.predict('SELECT * FROM location').then(function (data) {
                data.should.be.an.Array;
                resource = data;
                done();
            });
        });

        describe('Data handling', function () {

            var primeData = {};
            it('should get area with highest demand', function () {
                var result = main.getHighestDemand(resource);
                result.should.equal(_.max(resource, 'demand'));
                primeData = result;
            });

            it('should able to receive event resource', function () {
                main.getResource(primeData);
                redisClient.get("predictions", function(e, value){
                    should.exists(value);
                });
            });
        });
    });


}).call(this);