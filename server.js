require("dotenv").config();

const express = require('express')
const connectDB = require('./database/db');
const UserRoute = require('./routes/userRoute');
const ImageRoute = require('./routes/imageRoute');
const {configureCors} = require("./config/corsConfig");
const {requestLogger, addTimestamp} = require("./middleware/customMiddleware");
const {globalErrorHandler} = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3010

connectDB();
app.use(addTimestamp);

app.use(configureCors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to the API");
});

app.use('/api/auth', UserRoute);
app.use('/api', UserRoute);

app.use(globalErrorHandler);

//For Image
app.use('/api', ImageRoute);

app.use(requestLogger);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})