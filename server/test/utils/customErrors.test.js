import {
    CustomError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    BusinessLogicError,
    NotFoundError,
    ServerError,
    MongooseValidationError,
  } from '../../utils/customErrors.js';
  
  describe('Custom Errors Unit Tests', () => {
    describe('CustomError', () => {
      test('should create a custom error with message, status code, and empty errors', () => {
        const error = new CustomError('Something went wrong', 400);
  
        expect(error.message).toBe('Something went wrong');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('CustomError');
      });
  
      test('should return error as JSON format', () => {
        const error = new CustomError('Validation error', 400, [{ field: 'name', message: 'Name is required' }]);
  
        const json = error.toJSON();
        expect(json).toEqual({
          success: false,
          error: {
            message: 'Validation error',
            errors: [{ field: 'name', message: 'Name is required' }],
          },
          statusCode: 400,
        });
      });
    });
  
    // Test UnauthorizedError class
    describe('UnauthorizedError', () => {
      test('should create an UnauthorizedError with default message and 401 status', () => {
        const error = new UnauthorizedError();
  
        expect(error.message).toBe('Unauthorized access');
        expect(error.statusCode).toBe(401);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('UnauthorizedError');
      });
  
      test('should create an UnauthorizedError with custom message', () => {
        const error = new UnauthorizedError('Custom unauthorized message');
  
        expect(error.message).toBe('Custom unauthorized message');
        expect(error.statusCode).toBe(401);
        expect(error.errors).toEqual([]);
      });
    });
  
    // Test ForbiddenError class
    describe('ForbiddenError', () => {
      test('should create a ForbiddenError with default message and 403 status', () => {
        const error = new ForbiddenError();
  
        expect(error.message).toBe('Forbidden action');
        expect(error.statusCode).toBe(403);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('ForbiddenError');
      });
  
      test('should create a ForbiddenError with custom message', () => {
        const error = new ForbiddenError('Custom forbidden message');
  
        expect(error.message).toBe('Custom forbidden message');
        expect(error.statusCode).toBe(403);
        expect(error.errors).toEqual([]);
      });
    });
  
    // Test ValidationError class
    describe('ValidationError', () => {
      test('should create a ValidationError with default message and 400 status', () => {
        const error = new ValidationError();
  
        expect(error.message).toBe('Validation failed');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('ValidationError');
      });
  
      test('should create a ValidationError with custom message and error details', () => {
        const error = new ValidationError('Invalid input', [{ field: 'email', message: 'Email is invalid' }]);
  
        expect(error.message).toBe('Invalid input');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([{ field: 'email', message: 'Email is invalid' }]);
      });
    });
  
    // Test BusinessLogicError class
    describe('BusinessLogicError', () => {
      test('should create a BusinessLogicError with default message and 400 status', () => {
        const error = new BusinessLogicError();
  
        expect(error.message).toBe('Business logic error occurred');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('BusinessLogicError');
      });
  
      test('should create a BusinessLogicError with custom message and error details', () => {
        const error = new BusinessLogicError('Custom business error', [{ field: 'amount', message: 'Invalid amount' }]);
  
        expect(error.message).toBe('Custom business error');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([{ field: 'amount', message: 'Invalid amount' }]);
      });
    });
  
    // Test NotFoundError class
    describe('NotFoundError', () => {
      test('should create a NotFoundError with default message and 404 status', () => {
        const error = new NotFoundError();
  
        expect(error.message).toBe('Resource not found');
        expect(error.statusCode).toBe(404);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('NotFoundError');
      });
  
      test('should create a NotFoundError with custom message', () => {
        const error = new NotFoundError('Custom not found message');
  
        expect(error.message).toBe('Custom not found message');
        expect(error.statusCode).toBe(404);
        expect(error.errors).toEqual([]);
      });
    });
  
    // Test ServerError class
    describe('ServerError', () => {
      test('should create a ServerError with default message and 500 status', () => {
        const error = new ServerError();
  
        expect(error.message).toBe('Internal Server Error');
        expect(error.statusCode).toBe(500);
        expect(error.errors).toEqual([]);
        expect(error.name).toBe('ServerError');
      });
  
      test('should create a ServerError with custom message', () => {
        const error = new ServerError('Custom server error message');
  
        expect(error.message).toBe('Custom server error message');
        expect(error.statusCode).toBe(500);
        expect(error.errors).toEqual([]);
      });
    });
  
    // Test MongooseValidationError class
    describe('MongooseValidationError', () => {
      test('should create a MongooseValidationError with formatted Mongoose errors', () => {
        const mongooseError = {
          errors: {
            email: { message: 'Email is required' },
            password: { message: 'Password is too short' },
          },
        };
  
        const error = new MongooseValidationError(mongooseError);
  
        expect(error.message).toBe('Validation failed for some fields.');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is too short' },
        ]);
        expect(error.name).toBe('MongooseValidationError');
      });
    });
  });
  