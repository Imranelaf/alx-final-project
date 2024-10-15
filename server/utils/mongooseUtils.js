/*
 * This utility function checks if an ID is a valid MongoDB ObjectId. This is useful for ensuring that
 */

import mongoose from 'mongoose';

export const isValidObjectId = (id) => {
    console.log(isValidObjectId);
    return mongoose.Types.ObjectId.isValid(id);
};