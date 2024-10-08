import express from 'express';
const router = express.Router();

// Placeholder routes for admin-specific operations
router.get('/', (req, res) => {
  res.send('Admin route');
});

export default router;
