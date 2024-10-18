/**
 * This file contains the FAQ routes.
 */

import express from 'express';
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faq/faqController.js';

const router = express.Router();

// Get All FAQS (GET /api/faqs)
router.get('/', getAllFaqs);

// Create a new FAQ (POST /api/faqs)
router.post('/', createFaq);

// Update an existing FAQ (PUT /api/faqs/:id)
router.put('/:id', updateFaq);

// Delete an existing FAQ (DELETE /api/faqs/:id)
router.delete('/:id', deleteFaq);

export default router;

