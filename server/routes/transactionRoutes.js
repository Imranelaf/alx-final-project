/**
 * This file contains the transaction routes.
 */

import express from 'express';
const router = express.Router();

// Placeholder routes for transactions (buying, renting)
router.get('/', (req, res) => {
  res.send('Transaction route');
});

export default router;
