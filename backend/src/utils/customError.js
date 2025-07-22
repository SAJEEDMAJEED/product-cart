const customError = (statusCode, message, details = {}) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.details = details;
    return error;
}

module.exports = customError;