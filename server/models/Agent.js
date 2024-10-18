/**
 * This file defines the schema for the Agent model in a property management application.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * @desc Schema definition for the `Agent` model representing real estate agents in the system.
 */
const agentSchema = new mongoose.Schema({
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
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number.'], // E.164 format
  },
  agency: {
    type: String,
    maxlength: [100, 'Agency name cannot exceed 100 characters.'],
    required: [true, 'Agency name is required.'],
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters.'],
    default: '', // Default empty bio
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required.'],
    unique: true,
  },
  profileImage: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png', // Default avatar
    validate: {
      validator: function (value) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value); // Validate URLs for profile image
      },
      message: 'Please provide a valid image URL (jpg, jpeg, png, or webp).',
    },
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
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', // Reference to properties managed by the agent
  }],
   default: [], // Default empty array for properties
  role: {
    type: String,
    enum: ['agent'], // Only "agent" is allowed for this model
    default: 'agent', // Automatically assign "agent" role
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be below 0.'],
    max: [5, 'Rating cannot exceed 5.'],
    default: 0,
  },
  reviewsCount: {
    type: Number,
    default: 0, // Track how many reviews have been given
  },
  socialMediaLinks: {
    facebook: {
      type: String,
      match: [/^https?:\/\/(www\.)?facebook.com\/.+$/, 'Please provide a valid Facebook URL.'],
    },
    linkedin: {
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin.com\/.+$/, 'Please provide a valid LinkedIn URL.'],
    },
    twitter: {
      type: String,
      match: [/^https?:\/\/(www\.)?twitter.com\/.+$/, 'Please provide a valid Twitter URL.'],
    },
    default: {},
  },
  availability: {
    type: Boolean,
    default: true,
  },
  agentStatus: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending', // New agents start with 'pending' status until approved by an admin
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to hash the password before saving
agentSchema.pre('save', async function (next) {
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
agentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual property to get agent's full name
agentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual property to get the count of properties
agentSchema.virtual('propertiesCount').get(function () {
  return this.properties.length;
});

// Indexing important fields for performance
agentSchema.index({ email: 1 });
agentSchema.index({ licenseNumber: 1 });
agentSchema.index({ phoneNumber: 1 });
agentSchema.index({ agency: 1 });
agentSchema.index({ rating: 1 });
agentSchema.index({ role: 1 });
agentSchema.index({ agentStatus: 1 });
agentSchema.index({ username: 1 });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
