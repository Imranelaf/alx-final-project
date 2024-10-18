/**
 * This file contains a utility function to exclude sensitive fields from a Mongoose model object.
 */

/**
 * @desc Exclude sensitive fields from the Mongoose model object before sending the response.
 * @param {Object} modelObject - The Mongoose model object.
 * @param {Array<string>} fieldsToExclude - Array of fields to exclude from the object. Defaults to ['password'].
 * @returns {Object} - The object with specified fields excluded, ready to send as a response.
 */
export const excludeSensitiveInfo = (modelObject, fieldsToExclude = ['password']) => {
    const modelObj = modelObject.toObject(); // Convert Mongoose document to plain JS object
  
    fieldsToExclude.forEach(field => {
      delete modelObj[field];
    });
  
    return modelObj; // Return the sanitized object
  };
  