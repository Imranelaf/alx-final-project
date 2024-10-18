import jwt from 'jsonwebtoken';
import authenticateJWT from '../../middleware/auth/authMiddleware.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/customErrors.js';

describe('authenticateJWT Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
      cookies: {},
    };
    res = {};
    next = jest.fn();  // Mock the next function
  });

  it('should throw UnauthorizedError if token is missing', () => {
    req.header.mockReturnValue(null);  // Simulate no Authorization header
    
    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0].message).toBe('Unauthorized access. Token is missing, please log in.');
  });

  it('should throw ForbiddenError if token is invalid', () => {
    req.header.mockReturnValue('Bearer invalidToken');  // Simulate invalid token
    jwt.verify = jest.fn(() => { throw new Error(); });  // Mock jwt.verify to throw an error

    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    expect(next.mock.calls[0][0].message).toBe('Invalid token or session expired. Please log in again.');
  });

  it('should authenticate user successfully with a valid token', () => {
    const mockDecodedUser = { id: '123', name: 'John Doe' };
    req.header.mockReturnValue('Bearer validToken');  // Simulate valid token
    jwt.verify = jest.fn().mockReturnValue(mockDecodedUser);  // Mock jwt.verify to return decoded user

    authenticateJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
    expect(req.user).toEqual(mockDecodedUser);
    expect(next).toHaveBeenCalledWith();  // Continue to next middleware
  });
});
