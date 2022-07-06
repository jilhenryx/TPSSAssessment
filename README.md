# TPSS Assessment
TPSSAssessment is a transaction payment splitting service (TPSS).
The service is meant to calculate the amount due to one or more split payment "entities" as well as the amount left after all splits have been computed.

Main Implementations : [Split Handler](/utility/split-handler.js) and [Calculators](/utility/split-calculators.js)

## Frameworks and Libraries
This API service was built using 
1. [NodeJS](https://nodejs.org/) 
2. [ExpressJS](https://expressjs.com/)
3. [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) for Local Testing
4. [Postman](https://www.postman.com/) for Server Tests

## Running the Service
Ensure you have node installed on local machine before download.<br/>
In the root directory, run `npm install` to get all dependencies and `npm run start` to deploy on local machine.<br/>
The service exposes a single `HTTP POST` endpoint */split-payments/compute* that accepts a specific transaction [object type](/test/test-data.js)<br/>
Runs locally on *http://localhost:3000*



