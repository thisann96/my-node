require("dotenv").config();
const express = require('express')
const connectDB = require('./database/db');
const UserRoute = require('./routes/userRoute');
const ImageRoute = require('./routes/imageRoute');

const app = express();
const PORT = process.env.PORT || 3010

connectDB();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use('/api/auth', UserRoute);
app.use('/api', UserRoute);

//For Image
app.use('/api', ImageRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})