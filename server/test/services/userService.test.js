import {
    createNewUser,
    getUsersByFilterService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    addPropertyToUserService,
    removePropertyFromUserService
  } from '../../services/userService.js';
  
  import User from '../../models/User.js';
  import { NotFoundError, BusinessLogicError } from '../../utils/customErrors.js';
  
  // Mock the User model
  jest.mock('../../models/User.js');
  
  describe('User Service Basic Tests', () => {
  
    describe('Create New User', () => {
      test('should create a new user successfully', async () => {
        const mockUserData = { firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' };
        const mockCreatedUser = { ...mockUserData, _id: '12345' };
  
        User.create.mockResolvedValue(mockCreatedUser);
  
        const result = await createNewUser(mockUserData);
        expect(result).toEqual(mockCreatedUser);
      });
  
      test('should throw BusinessLogicError if duplicate fields are found', async () => {
        User.create.mockRejectedValue(new BusinessLogicError('Duplicate fields found'));
  
        await expect(createNewUser({ username: 'duplicate', email: 'duplicate@example.com' }))
          .rejects
          .toThrow(BusinessLogicError);
      });
    });
  
    describe('Get Users by Filter', () => {
      test('should return filtered users', async () => {
        const mockFilters = { firstName: 'John' };
        const mockUsers = [{ _id: '1', firstName: 'John', lastName: 'Doe' }];
  
        User.find.mockResolvedValue(mockUsers);
  
        const result = await getUsersByFilterService(mockFilters);
        expect(result).toEqual(mockUsers);
      });
  
      test('should return all users if no filters are provided', async () => {
        const mockUsers = [{ _id: '1', firstName: 'John' }, { _id: '2', firstName: 'Jane' }];
        User.find.mockResolvedValue(mockUsers);
  
        const result = await getUsersByFilterService({});
        expect(result).toEqual(mockUsers);
      });
    });
  
    describe('Get User by ID', () => {
      test('should return a user if valid ID is provided', async () => {
        const mockUser = { _id: '12345', firstName: 'John' };
        User.findById.mockResolvedValue(mockUser);
  
        const result = await getUserByIdService('12345');
        expect(result).toEqual(mockUser);
      });
  
      test('should throw NotFoundError if user is not found', async () => {
        User.findById.mockResolvedValue(null);
  
        await expect(getUserByIdService('invalidId')).rejects.toThrow(NotFoundError);
      });
    });
  
    describe('Update User', () => {
      test('should update the user successfully', async () => {
        const mockUpdates = { firstName: 'John Updated' };
        const mockUpdatedUser = { _id: '12345', ...mockUpdates };
  
        User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);
  
        const result = await updateUserService('12345', mockUpdates);
        expect(result).toEqual(mockUpdatedUser);
      });
  
      test('should throw NotFoundError if user is not found', async () => {
        User.findByIdAndUpdate.mockResolvedValue(null);
  
        await expect(updateUserService('invalidId', { firstName: 'New Name' })).rejects.toThrow(NotFoundError);
      });
    });
  
    describe('Delete User', () => {
      test('should delete the user successfully', async () => {
        const mockUser = { _id: '12345' };
        User.findById.mockResolvedValue(mockUser);
        User.prototype.deleteOne = jest.fn().mockResolvedValue(true);
  
        await deleteUserService('12345');
        expect(User.prototype.deleteOne).toHaveBeenCalled();
      });
  
      test('should throw NotFoundError if user is not found', async () => {
        User.findById.mockResolvedValue(null);
  
        await expect(deleteUserService('invalidId')).rejects.toThrow(NotFoundError);
      });
    });
  
    describe('Add Property to User', () => {
      test('should add a property to the user', async () => {
        const mockUser = { _id: '12345', properties: [] };
        const mockUpdatedUser = { _id: '12345', properties: ['propertyId'] };
  
        User.findById.mockResolvedValue(mockUser);
        User.prototype.save.mockResolvedValue(mockUpdatedUser);
  
        const result = await addPropertyToUserService('12345', 'propertyId');
        expect(result).toEqual(mockUpdatedUser);
      });
  
      test('should throw BusinessLogicError if property already exists in user', async () => {
        const mockUser = { _id: '12345', properties: ['propertyId'] };
        User.findById.mockResolvedValue(mockUser);
  
        await expect(addPropertyToUserService('12345', 'propertyId')).rejects.toThrow(BusinessLogicError);
      });
    });
  
    describe('Remove Property from User', () => {
      test('should remove a property from the user', async () => {
        const mockUser = { _id: '12345', properties: ['propertyId'] };
        const mockUpdatedUser = { _id: '12345', properties: [] };
  
        User.findById.mockResolvedValue(mockUser);
        User.prototype.save.mockResolvedValue(mockUpdatedUser);
  
        const result = await removePropertyFromUserService('12345', 'propertyId');
        expect(result).toEqual(mockUpdatedUser);
      });
  
      test('should throw BusinessLogicError if property does not exist in user', async () => {
        const mockUser = { _id: '12345', properties: [] };
        User.findById.mockResolvedValue(mockUser);
  
        await expect(removePropertyFromUserService('12345', 'propertyId')).rejects.toThrow(BusinessLogicError);
      });
    });
  });
  