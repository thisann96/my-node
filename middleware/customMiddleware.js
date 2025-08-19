const fs = require('fs');
const path = require('path');
const requestLogger = (err,req,res,next) =>{
    console.error(err);
    const date = new Date();
    const timeStamp = date.toISOString().split('T')[0];//YYYY-MM-DD
    const logFile = path.join(__dirname,"../","logs",`${timeStamp}.log`);

    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent');

    const logMessage = `
    [${date.toISOString()}]
    Method:${method}
    URL:${url}
    Message:${err.message}
    Stack:${err.stack}\n
    `;

    if(!fs.existsSync(path.join(__dirname,"../","logs"))){
        fs.mkdirSync(path.join(__dirname,"../","logs"));
    }

    fs.appendFile(logFile, logMessage, (error) => {
        if(error) console.log("Error writin to log file:",error);
    });

    console.log(`[${timeStamp}] ${method} ${url} - ${userAgent}`);
    // res.status(500).json({ error: "Internal Server Error" });
    next();
}

const addTimestamp = (req,res,next) => {
    req.timeStamp = new Date().toISOString();
    next();
}

module.exports = {requestLogger,addTimestamp}