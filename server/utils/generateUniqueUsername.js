import User from '../models/User.js';

async function generateUniqueUsername(firstName, lastName, email) {
    let baseUsername = (firstName + lastName).toLowerCase().replace(/\s+/g, '');

    // If no valid base username is created, fall back to the email prefix
    if (!baseUsername) {
        baseUsername = email.split('@')[0]; // Use email username part as fallback
    }

    let username = baseUsername;
    let suffix = 1;
    
    // Check if the generated username already exists in the database
    while (await User.findOne({ username })) {
      username = `${baseUsername}${suffix}`;
      suffix++;
    }
    
    return username;
}

export default generateUniqueUsername;

