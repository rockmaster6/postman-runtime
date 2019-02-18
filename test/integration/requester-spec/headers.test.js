var _ = require('lodash'),
    sinon = require('sinon'),
    expect = require('chai').expect;

describe('Requester Spec: sendNoCacheHeader and sendPostmanTokenHeader', function () {
    var testrun,
        HOST = 'https://www.postman-echo.com/get';

    describe('with undefined', function() {
        before(function(done) {
            this.run({
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request with `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
            expect(response.headers).to.have.property('cache-control', 'no-cache');
        });

        it('should send request with `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = testrun.response.getCall(0).args[2].stream.toString(),
                responseHeader = _.get(JSON.parse(response).headers, 'postman-token'),
                regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/mi;

            expect(regex.test(responseHeader)).to.be.true;
            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
        });
    });

    describe('with true', function() {
        before(function(done) {
            this.run({
                requester: {
                    sendNoCacheHeader: true,
                    sendPostmanTokenHeader: true
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request with `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
            expect(response.headers).to.have.property('cache-control', 'no-cache');
        });

        it('should send request with `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = testrun.response.getCall(0).args[2].stream.toString(),
                regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/mi,
                responseHeader = _.get(JSON.parse(response).headers, 'postman-token');

            expect(regex.test(responseHeader)).to.be.true;
            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
        });
    });

    describe('with false', function() {
        before(function(done) {
            this.run({
                requester: {
                    sendNoCacheHeader: false,
                    sendPostmanTokenHeader: false
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request without `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.not.include({key: 'Cache-Control', value: 'no-cache'});
            expect(response.headers).to.not.have.property('cache-control', 'no-cache');
        });

        it('should send request without `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = testrun.response.getCall(0).args[2].stream.toString(),
                regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/mi,
                responseHeader = _.get(JSON.parse(response).headers, 'postman-token');

            expect(regex.test(responseHeader)).to.be.false;
            expect(request.header).to.deep.not.include({key: 'Cache-Control', value: 'no-cache'});
        });
    });

    describe('with custom headers', function() {
        before(function(done) {
            this.run({
                requester: {
                    sendNoCacheHeader: true,
                    sendPostmanTokenHeader: true
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST,
                            header: {
                                'Cache-Control': 'max-age=1200',
                                'Postman-Token': 'CustomToken'
                            }
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should override `Cache-Control` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'max-age=1200'});
            expect(response.headers).to.have.property('cache-control', 'max-age=1200');
        });

        it('should override `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Postman-Token', value: 'CustomToken'});
            expect(response.headers).to.have.property('postman-token', 'CustomToken');
        });
    });
});
