/**
 * This file contains the controllers for the FAQ routes.
 */

import FAQ from '../../models/Faq.js';
import { formatError } from '../../utils/errorFormatter.js';

// Get all FAQs Controller
export const getAllFaqs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    return next(formatError('Error retrieving FAQs', [], 500));
  }
};

// Create a new FAQ Controller
export const createFaq = async (req, res, next) => {
  const { question, answer, category, priority, isPublished, tags } = req.body;

  try {
    const faq = new FAQ({
      question,
      answer,
      category,  // Optional category
      priority,  // Optional priority
      isPublished, // Optional publication status
      tags       // Optional tags (array of strings)
    });

    await faq.save(); // Save the new FAQ to the database
    res.status(201).json(faq); // Return the created FAQ
  } catch (error) {
    return next(formatError('Error creating FAQ', [{ field: 'general', message: error.message }], 400));
  }
};

// Update a FAQ Controller
export const updateFaq = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      return next(formatError('FAQ not found', [{ field: 'id', message: `FAQ with id ${id} not found` }], 404));
    }

    // Object to track updated fields
    const fieldsUpdated = [];

    // Only update fields that were passed in req.body
    for (const key in updates) {
      if (faq[key] !== undefined) { // Ensure the key exists in the FAQ object
        faq[key] = updates[key];
        fieldsUpdated.push(key);
      }
    }

    // Save the updated FAQ
    await faq.save();

    // Respond with a detailed success message
    res.status(200).json({
      message: 'FAQ was successfully updated.',
      id: id,
      fieldsUpdated: fieldsUpdated.length ? fieldsUpdated : 'No fields were updated',
      faq
    });

  } catch (error) {
    return next(formatError('Error updating FAQ', [{ field: 'id', message: error.message }], 500));
  }
};

// Delete a FAQ Controller
export const deleteFaq = async (req, res, next) => {
  const { id } = req.params; // Extract the id from the URL

  try {
    const faq = await FAQ.findByIdAndDelete(id); // Find and delete the FAQ by id
    if (!faq) {
      return next(formatError('FAQ not found', [{ field: 'id', message: `FAQ with id ${id} not found` }], 404));
    }

    res.status(200).json({
      message: 'FAQ was successfully deleted',
      id: id
    });
  } catch (error) {
    return next(formatError('Error deleting FAQ', [{ field: 'id', message: error.message }], 500));
  }
};
