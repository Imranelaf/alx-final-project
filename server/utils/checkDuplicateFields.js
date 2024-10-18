/**
 * This file contains a utility function to check for duplicate fields in the database.
 */

/**
 * @desc Checks for duplicate fields in the database and returns an array of duplicate field errors if found.
 * @param {Model} model - The Mongoose model to search for existing records.
 * @param {Object} fieldsToCheck - The fields to check for duplicates (e.g., username, email, phoneNumber).
 * @returns {Array} - Returns an array of duplicate field errors or an empty array if no duplicates are found.
 */
export const checkDuplicateFields = async (model, fieldsToCheck) => {
  const duplicateErrors = [];

  // Build the query to search for any matching records
  const query = {
    $or: Object.keys(fieldsToCheck).map((field) => ({ [field]: fieldsToCheck[field] })),
  };

  // Find an existing record that matches one of the fields
  const existingRecord = await model.findOne(query);

  // If an existing record is found, check for which fields are duplicates
  if (existingRecord) {
    Object.keys(fieldsToCheck).forEach((field) => {
      if (existingRecord[field] === fieldsToCheck[field]) {
        duplicateErrors.push({
          field,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use.`,
        });
      }
    });
  }

  // Return an array of duplicate errors (empty array if no duplicates found)
  return duplicateErrors;
};
