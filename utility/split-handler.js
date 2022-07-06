const { flatCalculator, percentCalculator, ratioCalculator, splitCalculator } = require('./split-calculators');

// Defines Operations and Holds Entity Information for Each Split Type
class SplitManager {
    constructor() {
        this.splitMap = new Map();
        //Add New Split Type and Calculator Here
        this.splitMap.set("FLAT", flatCalculator);
        this.splitMap.set("PERCENTAGE", percentCalculator);
        this.splitMap.set("RATIO", ratioCalculator);

        /** 
        * Map Container for split entity information.
        * Container is populated dynamically based on Split Info received
        * Key:
        *   SplitType - Corresponding to a split type id e.g "FLAT"
        * Value:
        *   An Object containing an array of entities, and extra properties depending on type
        *   For example, the ratio split type has a totalRatio property.
        *   Each entity in the array is an object of split Info and index
        */
        this.splitData = new Map();
    }
}

/**
 * Split Error Class
 * @param {String} message : error message
 */
class SplitError {
    constructor(message) {
        this.message = message;
    }
}

/**
 * Split Result Class
 * @param {Object} value : result of split operation
 * @param {String} errorMessage : Information about error encountered
 */
class SplitResult {
    constructor(value, errorMessage = "") {
        this.value = value;
        this.errorMessage = errorMessage;
    }
}

/**
 * Split handler function that exposes split operation
 * @param {Number} amount : Initial Transaction Amount
 * @param {Array<Object>} splitInfo : List of Split Entities 
 * @returns {Object} SplitResult
 */
function splitHandler(amount, splitInfo) {
    const splitManager = new SplitManager();
    let calculatedResult = {};

    try {
        categorizeSplitData(splitInfo, splitManager);
        calculatedResult = performCalculation(
            parseInt(amount),
            splitManager,
            splitInfo.length
        );
    }
    catch (error) {
        return (new SplitResult({}, error.message));
    }
    return new SplitResult(calculatedResult);
}

/**
 * Categorizes entites from SplitInfo array by SplitType keeping original index intact
 *  @param {Object} splitInfo :  List of split entities
 *  @param {Object} splitManager : Split Operation Manager. It holds a map of recognized split types
 *      and their corresponding calculators and a dynamic map for split data
 * @returns : Nothing
 * @throws {SplitError}
 */
function categorizeSplitData(splitInfo, splitManager) {
   
    let totalRatio = 0; //Keep track of total ratio

    for (let i in splitInfo) {
        try {
            //Get Split Entity Info
            const splitEntity = splitInfo[i];
            const splitTypeID = splitEntity["SplitType"];

            //Check that entity SplitType is recognized
            if (splitManager.splitMap.has(splitTypeID)) {

                //Dynamic Map to store categorized entities
                const splitData = splitManager.splitData;

                //Create SplitData entry for SplitType has not been encountered before 
                if (!(splitData.has(splitTypeID))) {
                    splitData.set(splitTypeID, { entities: [] });
                }

                const typeData = splitData.get(splitTypeID);

                typeData.entities.push({
                    entityInfo: splitEntity,
                    index: parseInt(i),
                });

                //Save total ratio for ratio type
                if (splitTypeID === "RATIO") {
                    totalRatio += parseInt(splitEntity["SplitValue"]);
                    typeData.totalRatio = totalRatio;
                }

            }
            else {
                console.log(`SplitItem -> ${JSON.stringify(splitEntity)}`);
                throw new SplitError(`Unrecognised SplitType: ${JSON.stringify(splitEntity)}`);
            }
        }
        catch (error) {
            console.log(`Error while parsing split data.\n${error.message}`);
            throw new SplitError(
                `Error encountered while retrieving split data. Check that all fields are correct.\n${error.message}`);
        }
    }
}

/**
 * Performs split calculations using predefined sequence.
 * @param {Number} amount : Initial transaction amount.
 * @param {Object} splitManager : Split Operation Manager. It holds a map of recognized split types
 *      and their corresponding calculators and a dynamic map for split data 
 * @param {Number} splitInfoSize : The number of split entities
 * @returns {Object} calculatedResult: The balance from calculations and split breakdown
 * 
 * @throws {SplitError}
 */
function performCalculation(amount, splitManager, splitInfoSize) {

    if(!amount || isNaN(amount)){
        throw new SplitError("Invalid Amount. Please check amount key and input");
    }

    let balance = amount;
    /*
    * Array will be populated at arbitrary positions using the index
    * preserved during categorization. To ensure there are no holes,
    * Array's length is set to be exactly same as SplitInfo array's length
    */
    let splitBreakdown = Array(splitInfoSize); 

    //Iterate over each recognised predefined SplitType
    for (const [key, calculator] of splitManager.splitMap) {

        try {
            //Verify that predefined SplitType is part of input data from client
            if (splitManager.splitData.has(key)) {

                if (balance === 0) {
                    throw new SplitError("Insuffiecient amount to complete transaction");
                }
                
                console.log(`${key} Calculations. Initial Amount: ${balance}`);

                const typeData = splitManager.splitData.get(key);
                balance = splitCalculator(balance, typeData, calculator, splitBreakdown);
            }
        }
        catch (error) {
            console.log(`Error Performing Calculations: ${error.message}`);
            throw new SplitError(error.message);
        }
    }

    return { balance: balance, breakdown: splitBreakdown };
}

module.exports = {splitHandler, categorizeSplitData, performCalculation}