import {
    getUsersByFilter,
    getUserById,
    updateUser,
    deleteUser,
    addPropertyToUser,
    removePropertyFromUser,
  } from '../../controllers/user/userController.js';
  
  import {
    getUsersByFilterService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    addPropertyToUserService,
    removePropertyFromUserService,
  } from '../../services/userServices.js';
  
  import { excludeSensitiveInfo } from '../../utils/excludeSensitiveInfo.js';
  
  jest.mock('../../services/userServices.js'); // Mock the user services
  jest.mock('../../utils/excludeSensitiveInfo.js'); // Mock the excludeSensitiveInfo function
  
  describe('User Controller', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { params: {}, body: {}, query: {}, user: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getUsersByFilter', () => {
      it('should return users with sensitive info excluded', async () => {
        const mockUsers = [{ _id: '123', name: 'John Doe' }];
        getUsersByFilterService.mockResolvedValue(mockUsers);
        excludeSensitiveInfo.mockReturnValue(mockUsers[0]);
  
        await getUsersByFilter(req, res, next);
  
        expect(getUsersByFilterService).toHaveBeenCalledWith(req.query);
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockUsers[0], ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockUsers,
        });
      });
  
      it('should handle errors in getUsersByFilter and call next with error', async () => {
        const mockError = new Error('Test error');
        getUsersByFilterService.mockRejectedValue(mockError);
  
        await getUsersByFilter(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('getUserById', () => {
      it('should retrieve a user by ID and return sanitized user', async () => {
        const mockUser = { _id: '123', name: 'John Doe' };
        req.params.id = '123';
        getUserByIdService.mockResolvedValue(mockUser);
        excludeSensitiveInfo.mockReturnValue(mockUser);
  
        await getUserById(req, res, next);
  
        expect(getUserByIdService).toHaveBeenCalledWith('123');
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockUser, ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockUser,
        });
      });
  
      it('should handle errors in getUserById and call next with error', async () => {
        const mockError = new Error('Test error');
        getUserByIdService.mockRejectedValue(mockError);
  
        await getUserById(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('updateUser', () => {
      it('should update the user and return sanitized data', async () => {
        const mockUpdatedUser = { _id: '123', name: 'Updated User' };
        req.params.id = '123';
        req.body = { name: 'Updated User' };
        req.user = { role: 'admin' };
  
        updateUserService.mockResolvedValue(mockUpdatedUser);
        excludeSensitiveInfo.mockReturnValue(mockUpdatedUser);
  
        await updateUser(req, res, next);
  
        expect(updateUserService).toHaveBeenCalledWith('123', req.body, 'admin');
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockUpdatedUser, ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'User information updated successfully.',
          data: mockUpdatedUser,
        });
      });
  
      it('should handle errors in updateUser and call next with error', async () => {
        const mockError = new Error('Test error');
        updateUserService.mockRejectedValue(mockError);
  
        await updateUser(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('deleteUser', () => {
      it('should delete a user and return success response', async () => {
        req.params.id = '123';
  
        await deleteUser(req, res, next);
  
        expect(deleteUserService).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'User deleted successfully!',
        });
      });
  
      it('should handle errors in deleteUser and call next with error', async () => {
        const mockError = new Error('Test error');
        deleteUserService.mockRejectedValue(mockError);
  
        await deleteUser(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('addPropertyToUser', () => {
      it('should add a property to the user and return updated user', async () => {
        const mockUpdatedUser = { _id: '123', properties: ['property1'] };
        req.params.userId = '123';
        req.body.propertyId = 'property1';
  
        addPropertyToUserService.mockResolvedValue(mockUpdatedUser);
  
        await addPropertyToUser(req, res, next);
  
        expect(addPropertyToUserService).toHaveBeenCalledWith('123', 'property1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Property added to user successfully.',
          data: mockUpdatedUser,
        });
      });
  
      it('should handle errors in addPropertyToUser and call next with error', async () => {
        const mockError = new Error('Test error');
        addPropertyToUserService.mockRejectedValue(mockError);
  
        await addPropertyToUser(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('removePropertyFromUser', () => {
      it('should remove a property from the user and return updated user', async () => {
        const mockUpdatedUser = { _id: '123', properties: [] };
        req.params.userId = '123';
        req.body.propertyId = 'property1';
  
        removePropertyFromUserService.mockResolvedValue(mockUpdatedUser);
  
        await removePropertyFromUser(req, res, next);
  
        expect(removePropertyFromUserService).toHaveBeenCalledWith('123', 'property1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Property removed from user successfully.',
          data: mockUpdatedUser,
        });
      });
  
      it('should handle errors in removePropertyFromUser and call next with error', async () => {
        const mockError = new Error('Test error');
        removePropertyFromUserService.mockRejectedValue(mockError);
  
        await removePropertyFromUser(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  });
  