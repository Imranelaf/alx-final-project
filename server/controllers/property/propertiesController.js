import Property from '../../models/Property.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Create a new property listing
 * @route   POST /api/properties
 * @access  Private (Agents/Admins only)
 */
export const createProperty = async (req, res, next) => {
  // Extract validation errors from express-validator
  const validationErrors = validationResult(req);
  let errors = [];

  //Collect validation errors and ensure both `field` and `message` are included
  if (!validationErrors.isEmpty()) {
    errors = validationErrors.array().map(err => ({
      field: err.path, // Returns the field name
      message: err.msg, // Error message for that field
    }));
  }

  const {
    title, description, propertyType, price, status, size, bedrooms, bathrooms, rooms,
    offerType, wifi, petFriendly, parking, yearBuilt, availableFrom, address, images,
    amenities, coordinates
  } = req.body;

  try {
    // If there are any validation errors, pass them to the global error handler
    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.errors = errors;
      return next(error);  // Forward errors to the global error handler
    }

    // Create a new property object using the Property model
    const newProperty = new Property({
      title,
      description,
      propertyType,
      price,
      status,
      size,
      bedrooms,
      bathrooms,
      rooms,
      offerType,
      wifi: wifi || false,
      petFriendly: petFriendly || false,
      parking: parking || false,
      yearBuilt,
      availableFrom,
      address,
      images: images || [],
      amenities: amenities || [],
      agentId: req.user._id,  // Use the authenticated user's ID (from `req.user`)
      coordinates,
    });

    //Save the new property to the database
    const savedProperty = await newProperty.save();

    // Return success response with the newly created property and its ID
    return res.status(201).json({
      success: true,
      message: 'Property created successfully!',
      data: {
        id: savedProperty._id,  // Return the generated property ID
        property: savedProperty  // Include the full property object
      }
    });

  } catch (error) {
    // Catch any server errors and pass them to the global error handler
    return next(error);
  }
};
