const { categorizeSplitData, performCalculation } = require('../utility/split-handler');
const { flatCalculator, percentCalculator, ratioCalculator } = require('../utility/split-calculators');
const { testData } = require('./test-data');
const expect = require('chai').expect;

//Mock SplitManager
function SplitManager() {
    this.splitMap = new Map();
    this.splitMap.set("FLAT", flatCalculator);
    this.splitMap.set("PERCENTAGE", percentCalculator);
    this.splitMap.set("RATIO", ratioCalculator);
    this.splitData = new Map();
}

describe("Split Handler", function () {
    const splitManager = [new SplitManager(), new SplitManager()];
    const expectedLength = [1, 3]

    it("categorizes split testdata based on type", function () {
        for (let i in testData) {
            const data = testData[i];
            categorizeSplitData(data.SplitInfo, splitManager[i]);
            const categorizedSplitData = splitManager[i].splitData;

            expect(categorizedSplitData.get("FLAT").entities.length).to.equal(expectedLength[i]);
            expect(categorizedSplitData.get("PERCENTAGE").entities.length).to.equal(expectedLength[i]);
            expect(categorizedSplitData.get("RATIO").entities.length).to.equal(expectedLength[i]);
        }
    });

    const expectedBalance = [0, 4.547473508864641e-13]

    it("performs calculations on splitinfo of testData", function () {
        for (let i in testData) {
            const data = testData[i];
            const amount = data.Amount;
            const splitInfo = data.SplitInfo;
            const splitSize = splitInfo.length;

            const calculatedResult = performCalculation(amount, splitManager[i], splitSize)

            expect(calculatedResult.balance).to.equal(expectedBalance[i]);
            
            //Verify Entities maintain original index position in response
            for (let i = 0; i < splitSize; i++) {
                expect(calculatedResult.breakdown[i].SplitEntityId).to.equal((splitInfo[i]).SplitEntityId)
            }
        }

    });

});


describe("Calculators", function () {

    const splitValues = [3, 2, 4, 1];
    const amount = 4500;
    it("calculates amount due based on percent rule", function () {
        let balance = amount;
        for (value in splitValues) {
            const amountDue = percentCalculator(value, balance);
            const expectedValue = (value * balance) / 100;

            expect(amountDue).to.equal(expectedValue);
            balance -= amountDue
        }


    });
    it("calculates amount due based on ratio rule", function () {
        const totalRatio = splitValues.reduce((a, b) => a + b, 0);
        for (let value in splitValues) {
            const expectedValue = (value / totalRatio) * amount;
            const amountDue = ratioCalculator(value, amount, totalRatio);

            expect(amountDue).to.equal(expectedValue);
        }

    });
});