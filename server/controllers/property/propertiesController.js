import { 
  createNewProperty,
  getPropertyByIdService,
  deletePropertyService,
  getPropertiesByFilterService,
  addPropertyImageService, 
  removePropertyImageService,
  addPropertyAmenityService, 
  removePropertyAmenityService 
 } from '../../services/propertyService.js';
import { updatePropertyService } from '../../services/propertyService.js';

/**
 * @desc    Controller to handle the creation of a new property.
 * @param   {Object} req - Express request object containing the property data.
 * @param   {Object} res - Express response object used to send the result of the creation process.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success response with the created property's data.
 */
export const createProperty = async (req, res, next) => {
  try {
      const newProperty = await createNewProperty(req.body);

      return res.status(201).json({
          success: true,
          message: 'Property created successfully.',
          data: newProperty,
      });
  } catch (error) {
      next(error);
  }
};

/**
 * @desc    Controller to handle retrieving a property by ID from the database.
 * @param   {Object} req - Express request object containing the property ID in params.
 * @param   {Object} res - Express response object for sending the property data.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {Object} - Success response with property data or formatted error.
 */
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await getPropertyByIdService(id);

    return res.status(200).json({
      success: true,
      data: property, 
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to update a specific property's information.
 * @route   PUT /api/properties/:id
 * @access  Private (Admin or Property Owner)
 * @param   {Object} req - Express request object containing the property ID in params and updated data in the body.
 * @param   {Object} res - Express response object for sending the updated property data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with updated property data or error.
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userRole = req.user.role;

    const updatedProperty = await updatePropertyService(id, updates, userRole);

    return res.status(200).json({
      success: true,
      message: 'Property information updated successfully.',
      data: updatedProperty, 
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to delete a property by ID and remove its reference from users/agents.
 * @route   DELETE /api/properties/:id
 * @access  Private (Admin or Property Owner)
 * @param   {Object} req - Express request object containing the property ID in params.
 * @param   {Object} res - Express response object used to send the deletion result.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message or error response.
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deletePropertyService(id);

    return res.status(200).json({
      success: true,
      message: 'Property deleted and references updated successfully!',
    });
  } catch (error) {
    return next(error); 
  }
};

/**
 * @desc    Controller to fetch properties, either all or filtered based on query parameters.
 * @param   {Object} req - Express request object containing query parameters for filters.
 * @param   {Object} res - Express response object for sending the property data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with success status and list of properties.
 */
export const getPropertiesByFilter = async (req, res, next) => {
  try {
    const filters = req.query;

    const properties = await getPropertiesByFilterService(filters);

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to add an image to a property
 * @route   PUT /api/properties/:id/images
 * @access  Private (Admin, Owner, or Agent)
 */
export const addPropertyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const updatedProperty = await addPropertyImageService(id, imageUrl);

    return res.status(200).json({
      success: true,
      message: 'Image added successfully.',
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Controller to remove an image from a property
 * @route   PUT /api/properties/:id/images/remove
 * @access  Private (Admin, Owner, or Agent)
 */
export const removePropertyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const updatedProperty = await removePropertyImageService(id, imageUrl);

    return res.status(200).json({
      success: true,
      message: 'Image removed successfully.',
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Controller to add an amenity to a property
 * @route   PUT /api/properties/:id/amenities
 * @access  Private (Admin, Owner, or Agent)
 */
export const addPropertyAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amenity } = req.body;

    const updatedProperty = await addPropertyAmenityService(id, amenity);

    return res.status(200).json({
      success: true,
      message: 'Amenity added successfully.',
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Controller to remove an amenity from a property
 * @route   PUT /api/properties/:id/amenities/remove
 * @access  Private (Admin, Owner, or Agent)
 */
export const removePropertyAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amenity } = req.body;

    const updatedProperty = await removePropertyAmenityService(id, amenity);

    return res.status(200).json({
      success: true,
      message: 'Amenity removed successfully.',
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

