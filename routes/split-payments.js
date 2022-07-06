const express = require('express');
const router = express.Router();

router.use(express.json());

//Middleware Validator for Compute Endpoint
function inputValidator(req, res, next) {
    const reqBody = req.body;
    try {
        if (!reqBody) {
            console.log("Request Body is Empty");
            throw "Request Body is Empty";
        }

        if (isNaN(reqBody["ID"])) {
            console.log("Transaction ID is missing");
            throw "Transaction ID is required";
        }
        if (!reqBody["SplitInfo"]) {
            throw "Missing SplitInfo Array";
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
    next();

}


// Defines Response Object
class SplitResponse {
    constructor(id, balance = 0, breakdown = []) {
        this["ID"] = id;
        this["Balance"] = balance;
        this["SplitBreakdown"] = breakdown;
    }
}

router.post("/compute", inputValidator, (req, res) => {

    console.log("Compute Endpoint reached");

    const reqBody = req.body;

    //Handles Split Calculations. Handler is only needed if input validation passed. 
    const {splitHandler} = require('../utility/split-handler');

    const splitResult = splitHandler(reqBody["Amount"], reqBody["SplitInfo"]);

    if (splitResult.errorMessage !== "") {
        return res.status(500).send(splitResult.errorMessage);
    }
    else {
        const response = new SplitResponse(
            reqBody["ID"],
            balance = splitResult.value.balance,
            breakdown = splitResult.value.breakdown
        );
        return res.status(200).json(response);
    }
});


module.exports = router