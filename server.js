require("dotenv").config();

const appConfig = require("./config/myapp");
const express = require('express')
const connectDB = require('./database/db');
const UserRoute = require('./routes/userRoute');
const ImageRoute = require('./routes/imageRoute');
const {configureCors} = require("./config/corsConfig");
const {requestLogger, addTimestamp} = require("./middleware/customMiddleware");
const {globalErrorHandler} = require("./middleware/errorHandler");
const versionCheck = require("./middleware/versionCheckMiddleware");
const {limiter} = require("./middleware/rateLimit");


const app = express();
const PORT = process.env.PORT || 3010
const appVersion = appConfig().appVersion;
const maxApiCalls = appConfig().maxApiCalls;
const maxApiCallsTime = appConfig().maxApiCallsTime;

connectDB();
app.use(addTimestamp);

app.use(configureCors());

app.use(limiter(maxApiCalls, maxApiCallsTime));
app.use(express.json());
app.use(versionCheck(appVersion));

app.get('/', (req, res) => {
    res.send('Welcome Node');
});

app.use(`/api/${appVersion}/auth`, UserRoute);
app.use(`/api/${appVersion}`, UserRoute);

//For Image
app.use(`/api/${appVersion}`, ImageRoute);

app.use(globalErrorHandler);

app.use(requestLogger);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})