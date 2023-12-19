const responStatus = require("./reasonPhrases");
const statusCodes = require("./statusCodes");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = responStatus.BAD_REQUEST,
        status = statusCodes.BAD_REQUEST
    ) {
        super(message, status);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = responStatus.CONFLICT,
        statusCode = statusCodes.CONFLICT
    ) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = responStatus.UNAUTHORIZED,
        statusCode = statusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = responStatus.NOT_FOUND,
        statusCode = statusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = responStatus.FORBIDDEN,
        statusCode = statusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

class CreateDatabaseError extends ErrorResponse {
    constructor(
        message = responStatus.NOT_FOUND,
        statusCode = statusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    BadRequestError,
    AuthFailureError,
    ConflictRequestError,
    NotFoundError,
    ForbiddenError,
    CreateDatabaseError,
};
