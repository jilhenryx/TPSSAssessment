const expect = require('chai').expect;
const request = require('request');
const { parse } = require('request/lib/cookies');
const {testData, testDataResponse} = require('./test-data');

describe("API Test", function () {

    const options = {
        'method': 'POST',
        'url': 'http://localhost:3000/split-payments/compute',
        'headers': {
            'Content-Type': 'application/json'
        },
    };



    it("returns status 200", function (done) {
        for (let data of testData) {

            options.body = JSON.stringify(data);

            request(options, function (error, response) {
                expect(response.statusCode).to.equal(200);
            });
        }
        done();
    });

    it("returns correct split breakdown", function (done) {
        for (let i in testData) {
            const data = testData[i];
            const resData = testDataResponse[i];

            options.body = JSON.stringify(data);

            request(options, function (error, response, body) {
                const bodyObject = JSON.parse(body);
                expect(bodyObject["ID"]).to.equal(resData.ID);
                expect(bodyObject.Balance).to.equal(resData.Balance);

                for(i in data.SplitInfo){
                    expect(bodyObject.SplitBreakdown[i]).to.deep.equal(resData.SplitBreakdown[i]);
                }
            });
        }
        done();
    });


});