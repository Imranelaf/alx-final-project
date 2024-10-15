import Admin from '../models/Admin.js';
import { checkDuplicateFields } from '../utils/checkDuplicateFields.js';
import { 
  BusinessLogicError, 
  ServerError, 
  NotFoundError, 
  ValidationError,
  MongooseValidationError,
  ForbiddenError,
} from '../utils/customErrors.js';
import { removeRestrictedFields } from '../utils/removeRestrictedFields.js';


/**
 * Business logic to create a new admin.
 * @param {Object} adminData - The data for creating the new admin.
 * @throws {BusinessLogicError | ServerError} - Throws errors if something goes wrong.
 * @returns {Object} - The newly created admin.
 */
export const createNewAdmin = async (adminData) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password, role, permissions, profileImage } = adminData;

    // Check for duplicate fields (email, username, phoneNumber)
    const duplicateErrors = await checkDuplicateFields(Admin, { username, email, phoneNumber });

    // If duplicates are found, throw BusinessLogicError
    if (duplicateErrors.length > 0) {
      throw new BusinessLogicError('Duplicate fields found', duplicateErrors);
    }

    // Create a new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      role: role || 'admin',  // Default role is 'admin'
      permissions: permissions || ['manage_users', 'view_reports'],  // Default permissions for 'admin'
      profileImage,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Return the newly created admin
    return newAdmin;

  } catch (error) {
    // Throw any error to be caught by the controller
    if (error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error creating admin');  // Default to ServerError for unexpected errors
    }
  }
};

/**
 * Service to retrieve all admin users from the database.
 * @returns {Object[]} - Returns an array of admin objects with all fields.
 * @throws {Error} - Throws NotFoundError if no admins are found, or ServerError for other errors.
 */
export const getAllAdminsService = async () => {
  try {
    // Find all admins (do not exclude sensitive info here)
    const admins = await Admin.find();
    
    if (!admins || admins.length === 0) {
      throw new NotFoundError('No admins found');
    }

    // Return raw data to the controller
    return admins;

  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // Propagate the specific NotFoundError
    }

    // Wrap any other unexpected errors in a ServerError
    throw new ServerError('Error while fetching admins', 500);
  }
};

/**
 * Service to retrieve an admin by ID.
 * @param {string} id - The admin's ID from the request parameters.
 * @returns {Object} - Returns the found admin object or throws an error.
 */
export const getAdminByIdService = async (id) => {
  try {
    // Find the admin by ID, excluding the password field
    const admin = await Admin.findById(id)

    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Return the admin data
    return admin;

  } catch (error) {
    // Handle specific and unexpected errors
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error retrieving admin');
  }
};

/**
 * Service to delete an admin by ID.
 * @param {string} id - The admin's ID from the request parameters.
 * @throws {ValidationError} - If the ID is not a valid MongoDB ObjectId.
 * @throws {NotFoundError} - If the admin with the provided ID is not found.
 * @throws {ServerError} - For any server errors that occur.
 */
export const deleteAdminService = async (id) => {
  try {
    // Find the admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Delete the admin
    await admin.deleteOne();
  } catch (error) {
    // Handle specific errors or throw ServerError for unexpected cases
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error deleting admin');
  }
};

/**
 * Service to update a specific admin's information.
 * @param {string} id - The admin's ID.
 * @param {Object} updates - The updates to be applied to the admin.
 * @param {string} userRole - The role of the user making the update request (either 'admin' or 'super-admin').
 * @throws {ValidationError} - If the ID or fields are invalid.
 * @throws {NotFoundError} - If the admin is not found.
 * @throws {ForbiddenError} - If the user is not allowed to update 'role' or 'permissions'.
 * @throws {ServerError} - For any server-side errors that occur.
 * @returns {Object} - The updated admin object.
 */
export const updateAdminService = async (id, updates, userRole) => {
  try {
    // Prevent non-super admins from updating 'role' and 'permissions'
    if (userRole !== 'super-admin') {
      if ('role' in updates || 'permissions' in updates) {
        throw new ForbiddenError('Only super-admin can modify role or permissions.');
      }
    }

        // List of fields that cannot be modified
        const restrictedFields = ['role', 'joinedAt'];
        // Remove restricted fields from updates using the utility function
        const sanitizedUpdates = removeRestrictedFields(updates, restrictedFields);

    // Attempt to find and update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(id, sanitizedUpdates, {
      new: true,  // Return the updated document
      runValidators: true,  // Apply schema validations for fields like email and phone number
    });

    if (!updatedAdmin) {
      throw new NotFoundError('Admin not found');
    }

    return updatedAdmin;

  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      throw new MongooseValidationError(error);  // Custom error class to handle Mongoose validation errors
    } else if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;  // Propagate known errors
    }

    // Handle any unexpected server-side errors
    throw new ServerError('Server error while updating admin information');
  }
};

