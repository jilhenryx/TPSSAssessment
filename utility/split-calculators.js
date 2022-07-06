/**
 * Calculator Error Class
 * @param {String} message : error message
 */
class CalculationError {
    constructor(message) {
        this.message = message;
    }
}

/**
* Functions that calculates the amount due to split entities based on business rules
* TODO - This function is currently doing too much and should be modularized.
*
* @param {Number} amount : Amount to be used for calculation
* @param {Object}  typeData: Entity Object for a SplitType
* @param {Function} calculator: Calculates the amount due to an entity
* @param {Array<Object>} breakdown : List of entities after calculation. 
*   Each entity hold an ID and Amount Due to them
* @returns {Number} Balance left after calculations for a SplitType
* @throws {CalculationError}
*/
function splitCalculator(amount, typeData, calculator, breakdown) {
    
    const entities = typeData.entities;
    let balance = amount;

    for (let entity of entities) {
        try {
            const entityId = entity.entityInfo["SplitEntityId"];
            let splitValue = entity.entityInfo["SplitValue"];
            let amountDue = 0;

            if (!entityId || isNaN(splitValue)) {
                throw new CalculationError("Missing Required Key in SplitInfo.");
            }

            if (typeData.totalRatio) {
                amountDue = calculator(splitValue, amount, typeData.totalRatio);
            } else {
                amountDue = calculator(splitValue, balance);
            }

            if (amountDue < 0) {
                throw new CalculationError(`Amount Due to "${entityId}" is lesser than zero. Amount Due to an entity cannot be a negative number`);
            }

            balance -= amountDue;

            if (balance < 0) {
                throw new CalculationError(message = "Insuffiecient amount to complete transaction");
            }

            breakdown[entity.index] = {
                "SplitEntityId": entityId,
                "Amount": amountDue
            }

            console.log(`Amount Due for "${entityId}" = ${amountDue} | Balance: ${balance}`);

        }
        catch (error) {
            throw new CalculationError(message = error.message);
        }
    }

    return balance;
}

//Calculator Functions

/*Flat Calculator Could have been handled in-line during categorization
* but is treated as other types for maintainability purposes.
* For example if the precedence of split calculations changes, 
* only the SplitManager.splitMap will be affected and new business rules
* can be added to FlatCalculator with ease
*/

/**
 * Calculator for Flat Split Type
 * @param {Number} splitValue : Determines the final value of the amount due to an entity
 * @returns {Number} Amount due to entity
 */

function flatCalculator(splitValue) {
    return splitValue;
}

/**
 * Calculator for Percentage Split Type
 * @param {Number} splitValue : Determines the final value of the amount due to an entity
 * @param {Number} amount : The transaction amount remaining
 * @returns {Number} Amount due to entity 
 */

function percentCalculator(splitValue, amount) {
    return ((splitValue * amount) / 100);

}
/**
 * Calculator for Ratio Split Type
 * @param {Number} splitValue : Determines the final value of the amount due to an entity
 * @param {Number} amount : The transaction amount remaining
 * @param {Number} totalRatio: Sum of all ratio values
 * @returns {Number} Amount due to entity 
 */
function ratioCalculator(splitValue, amount, totalRatio) {
    return ((splitValue / totalRatio) * amount);
}

module.exports = { flatCalculator, percentCalculator, ratioCalculator, splitCalculator }