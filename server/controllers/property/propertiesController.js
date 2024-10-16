import { 
  createNewProperty,
  getPropertyByIdService,
  deletePropertyService,
  getPropertiesByFilterService
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
    const { id } = req.params; // Extract property ID from params

    // Call the service to get the property by ID
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

    // Call the service to update the property
    const updatedProperty = await updatePropertyService(id, updates, userRole);

    return res.status(200).json({
      success: true,
      message: 'Property information updated successfully.',
      data: updatedProperty,  // Send the updated property data
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to delete a property by ID.
 * @route   DELETE /api/properties/:id
 * @access  Private (Admin or Property Owner)
 * @param   {Object} req - Express request object containing the property ID in the params.
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
      message: 'Property deleted successfully!',
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
    // Pass query parameters to the service
    const filters = req.query;

    // Fetch properties based on filters (or all if no filters)
    const properties = await getPropertiesByFilterService(filters);

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    return next(error);
  }
};

