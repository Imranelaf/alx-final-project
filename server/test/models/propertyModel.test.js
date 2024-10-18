import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../setup/dbHandler.js'; // Assuming this handles the in-memory DB
import Property from '../../models/Property.js'; // Path to your Property model

describe('Property Model Basic Data Validation', () => {
  // Connect to in-memory MongoDB before running any tests
  beforeAll(async () => await connect());

  // Clear the database after each test
  afterEach(async () => await clearDatabase());

  // Close the in-memory database after all tests
  afterAll(async () => await closeDatabase());

  // Test case for valid property data
  test('should validate and save a property with valid data', async () => {
    const validProperty = {
      title: 'Lovely House',
      description: 'A beautiful house with a lovely garden.',
      propertyType: 'House',
      price: 250000,
      size: 2000,
      bedrooms: 3,
      bathrooms: 2,
      rooms: 5,
      offerType: 'Sale',
      wifi: true,
      petFriendly: true,
      parking: true,
      yearBuilt: 2010,
      availableFrom: new Date(),
      address: {
        street: '123 Elm St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Morocco'
      },
      images: ['https://example.com/image.jpg'],
      amenities: ['Pool', 'Gym'],
      isFeatured: true,
      coordinates: {
        lat: 34.05,
        lng: -118.25
      }
    };

    const property = new Property(validProperty);
    const savedProperty = await property.save();

    expect(savedProperty._id).toBeDefined();
    expect(savedProperty.title).toBe(validProperty.title);
    expect(savedProperty.price).toBe(validProperty.price);
    expect(savedProperty.amenities.length).toBe(2); // Checking amenities count
  });

  // Test case for invalid property data (missing required fields)
  test('should fail validation without required fields', async () => {
    const invalidProperty = new Property({
      description: 'Missing required fields like title and price',
      bedrooms: 2,
      bathrooms: 1,
      rooms: 3,
      offerType: 'Sale',
      address: {
        street: '123 Elm St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
    });

    let error;
    try {
      await invalidProperty.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.title).toBeDefined();
    expect(error.errors.price).toBeDefined();
  });

  // Test case for invalid property price (negative price)
  test('should fail validation with a negative price', async () => {
    const invalidProperty = new Property({
      title: 'Lovely House',
      description: 'Invalid price for the property.',
      propertyType: 'House',
      price: -250000, // Invalid negative price
      size: 2000,
      bedrooms: 3,
      bathrooms: 2,
      rooms: 5,
      offerType: 'Sale',
      address: {
        street: '123 Elm St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      }
    });

    let error;
    try {
      await invalidProperty.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.price).toBeDefined();
  });
});
