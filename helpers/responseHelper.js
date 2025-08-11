
//=========Success Response===============
const responseSuccess = (res, data, message = 'Sucess', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}


//================Fail Response=================

const responseFail = (res, error = 'Fail', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        error
    });
}


module.exports = {
    responseSuccess,
    responseFail
}