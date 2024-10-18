import {
    checkIsAdmin,
    checkIsSuperAdmin,
    checkIsAdminSelfOrSuperAdmin,
    checkIsAgentSelfOrAdmin,
    checkIsUserSelfOrAdmin,
    checkRoleToCreateProperty,
    checkIsAdminOrOwnerOrAgent,
  } from '../../middleware/auth/roleMiddleware.js';
  import { ForbiddenError, NotFoundError } from '../../utils/customErrors.js';
  import Property from '../../models/Property.js';
  
  // Mock the Property model
  jest.mock('../../models/Property.js');
  
  describe('Role Middleware', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = {
        user: {},
        params: {},
        header: jest.fn(),
      };
      res = { status: jest.fn(() => res), json: jest.fn() };
      next = jest.fn();
    });
  
    describe('checkIsAdmin', () => {
      it('should call next if user is an admin or super-admin', () => {
        req.user.role = 'admin';
        checkIsAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
  
      it('should throw ForbiddenError if user is not an admin', () => {
        req.user.role = 'user';
        checkIsAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        expect(next.mock.calls[0][0].message).toBe('Access forbidden: Admins only.');
      });
    });
  
    describe('checkIsSuperAdmin', () => {
      it('should call next if user is a super-admin', () => {
        req.user.role = 'super-admin';
        checkIsSuperAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
  
      it('should throw ForbiddenError if user is not a super-admin', () => {
        req.user.role = 'admin';
        checkIsSuperAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        expect(next.mock.calls[0][0].message).toBe('Access denied: You do not have the required permissions to perform this action.');
      });
    });
  
    describe('checkIsAgentSelfOrAdmin', () => {
      it('should call next if user is the agent themselves or an admin', () => {
        req.user.role = 'admin';
        checkIsAgentSelfOrAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith();
  
        req.user.role = 'agent';
        req.params.id = '123';
        req.user.id = '123';
        checkIsAgentSelfOrAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
  
      it('should throw ForbiddenError if user is neither the agent nor an admin', () => {
        req.user.role = 'agent';
        req.params.id = '123';
        req.user.id = '456';
        checkIsAgentSelfOrAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        expect(next.mock.calls[0][0].message).toBe('Access denied: You do not have the required permissions to perform this action.');
      });
    });
  
    describe('checkIsAdminOrOwnerOrAgent', () => {
      it('should call next if user is an admin', async () => {
        req.user.role = 'admin';
        await checkIsAdminOrOwnerOrAgent(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
  
      it('should call next if user is the owner or agent of the property', async () => {
        const mockProperty = { userId: '123', agentId: '456' };
        Property.findById.mockResolvedValue(mockProperty);
  
        req.params.id = '1';
        req.user.id = '123';
        await checkIsAdminOrOwnerOrAgent(req, res, next);
        expect(next).toHaveBeenCalledWith();
  
        req.user.id = '456';
        await checkIsAdminOrOwnerOrAgent(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
  
      it('should throw ForbiddenError if user is neither admin, owner, nor agent', async () => {
        const mockProperty = { userId: '123', agentId: '456' };
        Property.findById.mockResolvedValue(mockProperty);
  
        req.params.id = '1';
        req.user.id = '789';
        await checkIsAdminOrOwnerOrAgent(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        expect(next.mock.calls[0][0].message).toBe('Access denied: You are not authorized to modify this property.');
      });
  
      it('should throw NotFoundError if property is not found', async () => {
        Property.findById.mockResolvedValue(null);
        req.params.id = '1';
        await checkIsAdminOrOwnerOrAgent(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      });
    });
  });
  