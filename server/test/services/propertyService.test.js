import {
  createNewProperty,
  getPropertyByIdService,
  updatePropertyService,
  deletePropertyService,
  getPropertiesByFilterService,
  addPropertyImageService,
  removePropertyImageService,
  addPropertyAmenityService,
  removePropertyAmenityService
} from '../../services/propertyService.js';

import Property from '../../models/Property.js';
import User from '../../models/User.js';
import Agent from '../../models/Agent.js';
import { NotFoundError, BusinessLogicError } from '../../utils/customErrors.js';

jest.mock('../../models/Property.js');
jest.mock('../../models/User.js');
jest.mock('../../models/Agent.js');

describe('Property Service Basic Tests', () => {

  describe('Create New Property', () => {
    test('should create a new property successfully', async () => {
      const mockPropertyData = { title: 'Test Property', price: 100000 };
      const mockCreatedProperty = { ...mockPropertyData, _id: '12345' };

      Property.create.mockResolvedValue(mockCreatedProperty);  // Mock successful creation

      const result = await createNewProperty(mockPropertyData);
      expect(result).toEqual(mockCreatedProperty);
    });

    test('should throw error when property creation fails', async () => {
      Property.create.mockRejectedValue(new Error('Failed to create property'));

      await expect(createNewProperty({ title: 'Test Property' }))
        .rejects
        .toThrow('Error creating property');
    });
  });

  describe('Get Property By ID', () => {
    test('should return property if ID is valid', async () => {
      const mockProperty = { _id: '12345', title: 'Test Property' };
      Property.findById.mockResolvedValue(mockProperty);

      const result = await getPropertyByIdService('12345');
      expect(result).toEqual(mockProperty);
    });

    test('should throw NotFoundError if property is not found', async () => {
      Property.findById.mockResolvedValue(null);

      await expect(getPropertyByIdService('wrongId')).rejects.toThrow(NotFoundError);
    });
  });

  describe('Update Property', () => {
    test('should update the property successfully', async () => {
      const mockUpdates = { title: 'Updated Title' };
      const mockUpdatedProperty = { _id: '12345', ...mockUpdates };

      Property.findByIdAndUpdate.mockResolvedValue(mockUpdatedProperty);

      const result = await updatePropertyService('12345', mockUpdates);
      expect(result).toEqual(mockUpdatedProperty);
    });

    test('should throw NotFoundError if property is not found', async () => {
      Property.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updatePropertyService('wrongId', { title: 'New Title' }))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  // Testing property deletion
  describe('Delete Property', () => {
    test('should delete the property and update users/agents', async () => {
      const mockProperty = { _id: '12345' };
      Property.findById.mockResolvedValue(mockProperty);
      Property.prototype.deleteOne = jest.fn().mockResolvedValue(true);

      User.updateMany.mockResolvedValue({ nModified: 1 });
      Agent.updateMany.mockResolvedValue({ nModified: 1 });

      await deletePropertyService('12345');

      expect(Property.prototype.deleteOne).toHaveBeenCalled();
      expect(User.updateMany).toHaveBeenCalledWith({ properties: '12345' }, { $pull: { properties: '12345' } });
      expect(Agent.updateMany).toHaveBeenCalledWith({ properties: '12345' }, { $pull: { properties: '12345' } });
    });

    test('should throw NotFoundError if property is not found', async () => {
      Property.findById.mockResolvedValue(null);

      await expect(deletePropertyService('wrongId')).rejects.toThrow(NotFoundError);
    });
  });

  // Testing getting properties by filter
  describe('Get Properties by Filter', () => {
    test('should return filtered properties', async () => {
      const mockFilters = { title: 'Test' };
      const mockProperties = [{ _id: '1', title: 'Test Property' }];

      Property.find.mockResolvedValue(mockProperties);

      const result = await getPropertiesByFilterService(mockFilters);
      expect(result).toEqual(mockProperties);
    });

    test('should return all properties if no filters are applied', async () => {
      const mockProperties = [{ _id: '1', title: 'Property 1' }, { _id: '2', title: 'Property 2' }];
      Property.find.mockResolvedValue(mockProperties);

      const result = await getPropertiesByFilterService({});
      expect(result).toEqual(mockProperties);
    });
  });

  // Testing adding property image
  describe('Add Property Image', () => {
    test('should add image to the property', async () => {
      const mockProperty = { _id: '12345', images: [] };
      const mockUpdatedProperty = { _id: '12345', images: ['image1.jpg'] };

      Property.findById.mockResolvedValue(mockProperty);
      Property.findByIdAndUpdate.mockResolvedValue(mockUpdatedProperty);

      const result = await addPropertyImageService('12345', 'image1.jpg');
      expect(result).toEqual(mockUpdatedProperty);
    });

    test('should throw error if image already exists', async () => {
      const mockProperty = { _id: '12345', images: ['image1.jpg'] };
      Property.findById.mockResolvedValue(mockProperty);

      await expect(addPropertyImageService('12345', 'image1.jpg'))
        .rejects
        .toThrow(BusinessLogicError);
    });
  });

  // Testing removing property image
  describe('Remove Property Image', () => {
    test('should remove image from the property', async () => {
      const mockProperty = { _id: '12345', images: ['image1.jpg'] };
      const mockUpdatedProperty = { _id: '12345', images: [] };

      Property.findById.mockResolvedValue(mockProperty);
      Property.findByIdAndUpdate.mockResolvedValue(mockUpdatedProperty);

      const result = await removePropertyImageService('12345', 'image1.jpg');
      expect(result).toEqual(mockUpdatedProperty);
    });

    test('should throw error if image does not exist', async () => {
      const mockProperty = { _id: '12345', images: [] };
      Property.findById.mockResolvedValue(mockProperty);

      await expect(removePropertyImageService('12345', 'image1.jpg'))
        .rejects
        .toThrow(BusinessLogicError);
    });
  });

  // Testing adding property amenity
  describe('Add Property Amenity', () => {
    test('should add amenity to the property', async () => {
      const mockProperty = { _id: '12345', amenities: [] };
      const mockUpdatedProperty = { _id: '12345', amenities: ['Pool'] };

      Property.findById.mockResolvedValue(mockProperty);
      Property.prototype.save.mockResolvedValue(mockUpdatedProperty);

      const result = await addPropertyAmenityService('12345', 'Pool');
      expect(result).toEqual(mockUpdatedProperty);
    });

    test('should throw error if amenity already exists', async () => {
      const mockProperty = { _id: '12345', amenities: ['Pool'] };
      Property.findById.mockResolvedValue(mockProperty);

      await expect(addPropertyAmenityService('12345', 'Pool'))
        .rejects
        .toThrow(BusinessLogicError);
    });
  });

  // Testing removing property amenity
  describe('Remove Property Amenity', () => {
    test('should remove amenity from the property', async () => {
      const mockProperty = { _id: '12345', amenities: ['Pool'] };
      const mockUpdatedProperty = { _id: '12345', amenities: [] };

      Property.findById.mockResolvedValue(mockProperty);
      Property.prototype.save.mockResolvedValue(mockUpdatedProperty);

      const result = await removePropertyAmenityService('12345', 'Pool');
      expect(result).toEqual(mockUpdatedProperty);
    });

    test('should throw error if amenity does not exist', async () => {
      const mockProperty = { _id: '12345', amenities: [] };
      Property.findById.mockResolvedValue(mockProperty);

      await expect(removePropertyAmenityService('12345', 'Pool'))
        .rejects
        .toThrow(BusinessLogicError);
    });
  });
});
