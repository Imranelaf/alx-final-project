/**
 * This file contains the property model.
 */

import mongoose from 'mongoose';

// Create the schema for the Property model
const propertySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required:true
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Villa', 'Office', 'Studio'],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented', 'Pending'],
    default: 'Available'
  },
  size: {
    type: Number, 
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required:true
  },
  rooms: {
    type: Number,
    required: true
  },
  offerType: {
    type: String,
    enum: ['Sale', 'Rent'], // Offer type must be either for Sale or Rent
    required: [true, 'Offer type is required.']
  },
  wifi: {
    type: Boolean,
    default: false, // Boolean to indicate if Wi-Fi is available
  },
  petFriendly: {
    type: Boolean,
    default: false, // Boolean to indicate if the property is pet-friendly
  },
  parking: {
    type: Boolean,
    default: false, // Boolean to indicate if parking is available
  },
  
  availableFrom: {
    type: Date,
    default: Date.now, // Set default availability to current date
  },
  address: {
    street: {
      type: String,
      required:[true, 'Street is required.']
     
      
    },
    city: {
      type: String,
      required: [true, 'City is required.']
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
      default: 'Morocco'
    }
  },
  images: [
    {
      type: String,
    }
  ],
 
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Pre-save middleware to update `updatedAt` before saving
propertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property for displaying full address
propertySchema.virtual('fullAddress').get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.country}`;
});

// Indexing fields for faster queries (e.g., searching properties by price, status, or agent)
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ agentId: 1 });
propertySchema.index({ offerType: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;