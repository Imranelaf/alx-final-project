class CustomError extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = this.constructor.name;
    }

    toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                errors: this.errors.length > 0 ? this.errors : undefined,
            },
            statusCode: this.statusCode,
        };
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access', errors = []) {
        super(message, 401, errors);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden action', errors = []) {
        super(message, 403, errors);
    }
}

export class ValidationError extends CustomError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 400, errors);
    }
}

export class BusinessLogicError extends CustomError {
    constructor(message = 'Business logic error occurred', errors = []) {
        super(message, 400, errors);
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class ServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

export class MongooseValidationError extends ValidationError {
    constructor(mongooseError) {
        // Extract and format validation errors from Mongoose
        const formattedErrors = Object.keys(mongooseError.errors).map(key => ({
            field: key,
            message: mongooseError.errors[key].message,
        }));
        super('Validation failed for some fields.', formattedErrors);
    }
}


export { CustomError };
