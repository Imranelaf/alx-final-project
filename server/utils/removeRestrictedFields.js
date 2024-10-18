/**
 * This file contains a utility function to remove restricted fields from an updates object.
 */

/**
 * Utility function to remove restricted fields from an updates object.
 * @param {Object} data - The updates object containing fields to be created or modified.
 * @param {Array<string>} restrictedFields - An array of field names that should not be modified.
 * @returns {Object} - The sanitized updates object with restricted fields removed.
 */
export const removeRestrictedFields = (data, restrictedFields) => {
    // Create a shallow copy of updates to avoid directly modifying the original object
    const sanitizedUpdates = { ...data };
  
    // Loop through restrictedFields and delete them from updates if they exist
    restrictedFields.forEach(field => {
      if (field in sanitizedUpdates) {
        delete sanitizedUpdates[field];
      }
    });
  
    return sanitizedUpdates;
  };
  