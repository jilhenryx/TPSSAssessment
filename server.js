const express = require('express');
const splitPaymentRouter = require('./routes/split-payments');

const app = express();

//Routes are used incase API endpoints increases to make it scalable
app.use("/split-payments",splitPaymentRouter);


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});
