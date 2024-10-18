/**
 * This file contains the property services.
 */

import Property from '../models/Property.js';
import User from '../models/User.js';
import Agent from '../models/Agent.js';

import { 
    BusinessLogicError, 
    ServerError, 
    NotFoundError, 
    ValidationError,
    MongooseValidationError 
  } from '../utils/customErrors.js';
  import { removeRestrictedFields } from '../utils/removeRestrictedFields.js';

/**
 * @desc    Service to handle creating a new property.
 * @param   {Object} propertyData - Data for creating the property.
 * @returns {Object} - The created property document.
 * @throws  {ServerError} - Throws an error if property creation fails.
 */
export const createNewProperty = async (propertyData) => {
    try {
        const restrictedFields = ['createdAt', 'updatedAt', '_id', 'isFeatured'];
        const sanitizedData = removeRestrictedFields(propertyData, restrictedFields);

        // Attempt to create the property in the database
        const newProperty = await Property.create(sanitizedData);
        return newProperty;
    } catch (error) {
        console.error('Error creating property:', error);
        if (error.name === 'ValidationError') {
            throw new ValidationError('Mongoose validation failed.', error.errors);
        } else if (error.code === 11000) {
            throw new BusinessLogicError('Duplicate field error: Property already exists.');
        }
        throw new ServerError('Error creating property.');
    }
};

  /**
 * @desc    Service to retrieve a property by its ID from the database.
 * @param   {string} propertyId - The ID of the property to be fetched.
 * @returns {Object} - Returns the property object if found.
 * @throws  {NotFoundError} - If the property is not found.
 * @throws  {ServerError} - For other server errors.
 */
export const getPropertyByIdService = async (propertyId) => {
    try {
      const property = await Property.findById(propertyId);
  
      if (!property) {
        throw new NotFoundError(`Property with ID ${propertyId} not found`);
      }
  
      return property;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
  
      // Wrap any unexpected errors in a ServerError
      throw new ServerError('Error while fetching property', 500);
    }
};

/**
 * @desc    Service to update a specific property's information.
 * @param   {string} id - The property's ID.
 * @param   {Object} updates - The updates to be applied to the property.
 * @param   {string} userRole - The role of the user making the update request (either 'agent' or 'admin').
 * @throws  {ValidationError} - If the ID or fields are invalid.
 * @throws  {NotFoundError} - If the property is not found.
 * @throws  {ForbiddenError} - If the user is not allowed to update restricted fields.
 * @throws  {ServerError} - For any server-side errors that occur.
 * @returns {Object} - The updated property object.
 */
export const updatePropertyService = async (id, updates, userRole) => {
    try {
      const restrictedFields = ['createdAt', 'updatedAt', '_id', 'isFeatured'];
  
      const sanitizedUpdates = removeRestrictedFields(updates, restrictedFields);
  
      const updatedProperty = await Property.findByIdAndUpdate(id, sanitizedUpdates, {
        new: true,  // Return the updated document
        runValidators: true,  // Apply schema validations
      });
  
      if (!updatedProperty) {
        throw new NotFoundError('Property not found');
      }
  
      return updatedProperty;
  
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new MongooseValidationError(error);
      } else if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
  
      throw new ServerError('Server error while updating property information');
    }
};

/**
 * Service to delete a property by ID and remove its reference from users/agents.
 * @param {string} id - The property's ID.
 * @throws {NotFoundError} - If the property is not found.
 * @throws {ServerError} - If an error occurs during deletion.
 */
export const deletePropertyService = async (id) => {
  try {
    const property = await Property.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    await property.deleteOne();

    // Remove the property reference from users' and agents' properties array
    await User.updateMany(
      { properties: id },  // Match users with this property
      { $pull: { properties: id } }  // Remove the property from their properties array
    );

    await Agent.updateMany(
      { properties: id },  // Match agents with this property
      { $pull: { properties: id } }  // Remove the property from their properties array
    );

  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error deleting property and updating users/agents');
  }
};

/**
 * @desc    Service to fetch properties based on filters, or return all properties if no filters are provided.
 * @param   {Object} filters - Query parameters used for filtering properties.
 * @returns {Array} - Array of properties that match the filters or all properties if no filters are applied.
 */
export const getPropertiesByFilterService = async (filters) => {
  try {
    const query = {};

    // Add filters to the query dynamically based on the user input
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' }; // Case-insensitive match for title
    }

    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }

    if (filters.priceMin || filters.priceMax) {
      query.price = {};
      if (filters.priceMin) query.price.$gte = parseInt(filters.priceMin, 10);
      if (filters.priceMax) query.price.$lte = parseInt(filters.priceMax, 10);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.sizeMin || filters.sizeMax) {
      query.size = {};
      if (filters.sizeMin) query.size.$gte = parseFloat(filters.sizeMin);
      if (filters.sizeMax) query.size.$lte = parseFloat(filters.sizeMax);
    }

    if (filters.bedrooms) {
      query.bedrooms = { $gte: parseInt(filters.bedrooms, 10) }; // Minimum number of bedrooms
    }

    if (filters.bathrooms) {
      query.bathrooms = { $gte: parseInt(filters.bathrooms, 10) }; // Minimum number of bathrooms
    }

    if (filters.rooms) {
      query.rooms = { $gte: parseInt(filters.rooms, 10) }; // Minimum number of rooms
    }

    if (filters.offerType) {
      query.offerType = filters.offerType;
    }

    if (filters.wifi) {
      query.wifi = filters.wifi === 'true'; // Ensure it's a boolean
    }

    if (filters.petFriendly) {
      query.petFriendly = filters.petFriendly === 'true'; // Ensure it's a boolean
    }

    if (filters.parking) {
      query.parking = filters.parking === 'true'; // Ensure it's a boolean
    }

    if (filters.yearBuiltMin || filters.yearBuiltMax) {
      query.yearBuilt = {};
      if (filters.yearBuiltMin) query.yearBuilt.$gte = parseInt(filters.yearBuiltMin, 10);
      if (filters.yearBuiltMax) query.yearBuilt.$lte = parseInt(filters.yearBuiltMax, 10);
    }

    if (filters.city) {
      query['address.city'] = filters.city;
    }

    if (filters.state) {
      query['address.state'] = filters.state;
    }

    if (filters.zipCode) {
      query['address.zipCode'] = filters.zipCode;
    }

    if (filters.amenities) {
      query.amenities = { $all: filters.amenities.split(',').map(amenity => amenity.trim()) };
    }    

    if (filters.coordinatesLat || filters.coordinatesLng) {
      query.coordinates = {};
      if (filters.coordinatesLat) query['coordinates.lat'] = parseFloat(filters.coordinatesLat);
      if (filters.coordinatesLng) query['coordinates.lng'] = parseFloat(filters.coordinatesLng);
    }

    // Execute the query to fetch properties from the database
    const properties = await Property.find(query);

    // Return the array of properties
    return properties;
  } catch (error) {
    // Throw an error if any issue occurs
    throw new ServerError('Error fetching properties from the database');
  }
};

export const addPropertyImageService = async (propertyId, imageUrl) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (property.images.includes(imageUrl)) {
      throw new BusinessLogicError('Image URL already exists in the property.');
    }

    // Add the new image URL to the images array
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $push: { images: imageUrl } },  // Push new image if not found in array
      { new: true, runValidators: true }  // Return the updated document
    );

    return updatedProperty;
  } catch (error) {
    // Re-throw known errors (like BusinessLogicError)
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    }

    // Wrap and throw unexpected errors as ServerError
    throw new ServerError('Error adding image to property', 500, error);
  }
};

export const removePropertyImageService = async (propertyId, imageUrl) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (!property.images.includes(imageUrl)) {
      throw new BusinessLogicError('Image URL does not exist in the property.');
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { images: imageUrl } },  // Remove the image
      { new: true }  // Return the updated document
    );

    return updatedProperty;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    }

    throw new ServerError('Error removing image from property', 500, error);
  }
};

export const addPropertyAmenityService = async (propertyId, amenity) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (property.amenities.includes(amenity)) {
      throw new BusinessLogicError('Amenity already exists in the property.');
    }

    property.amenities.push(amenity);

    const updatedProperty = await property.save();

    return updatedProperty;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    }

    throw new ServerError('Error adding amenity to property', 500, error);
  }
};

export const removePropertyAmenityService = async (propertyId, amenity) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (!property.amenities.includes(amenity)) {
      throw new BusinessLogicError('Amenity does not exist in the property.');
    }

    property.amenities = property.amenities.filter(existingAmenity => existingAmenity !== amenity);

    // Save the updated property
    const updatedProperty = await property.save();

    return updatedProperty;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    }

    throw new ServerError('Error removing amenity from property', 500, error);
  }
};