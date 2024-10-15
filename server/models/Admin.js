/**
 * This file contains the schema for the Admin model.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * @desc Admin model schema to represent admin users in the system. 
 *       It includes personal details, authentication data, and role-based permissions.
 *       Passwords are hashed before saving for security.
 */
const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    maxlength: [50, 'First name cannot exceed 50 characters.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    maxlength: [50, 'Last name cannot exceed 50 characters.'],
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    minlength: [4, 'Username must be at least 4 characters long.'],
    maxlength: [30, 'Username cannot exceed 30 characters.'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number.'], // Format like +1234567890
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Minimum length is 6 characters'],
    validate: {
      validator: function (value) {
        // Password must include at least one uppercase letter, one lowercase letter, and one number
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value);
      },
      message: 'Password must include at least one uppercase letter, one lowercase letter, and one number.',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin',  // Default role is "admin"
  },
  permissions: {
    type: [String],
    default: function () {
      return this.role === 'super-admin'
        ? ['manage_users', 'manage_agents', 'view_reports', 'manage_admins']
        : ['manage_users', 'view_reports'];  // Default permissions for "admin"
    },
    validate: {
      validator: function (permissionsArray) {
        // Check that all permissions are strings
        return permissionsArray.every(permission => typeof permission === 'string');
      },
      message: 'Permissions must be valid strings.',
    },
  },
  profileImage: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png',
    validate: {
      validator: function (value) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
      },
      message: 'Please provide a valid image URL (jpg, jpeg, png, or webp).',
    },
  },
  joinedAt: {
    type: Date,
    default: Date.now, // Automatically set when admin is created
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to hash the password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method for comparing passwords during login/authentication
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual property to get admin's full name
adminSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexing important fields for performance
adminSchema.index({ email: 1 });
adminSchema.index({ phoneNumber: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ username: 1 });  // Index the username for performance

// Compile the schema into a model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
