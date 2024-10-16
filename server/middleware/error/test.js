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

const eror = new CustomError("Not found", 404)
console.log(eror.toJSON())