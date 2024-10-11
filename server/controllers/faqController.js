import FAQ from '../models/FAQ.js';

// Get all FAQs Controller
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving FAQs', error: error.message });
  }
};

// Create a new FAQ Controller
export const createFaq = async (req, res) => {
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
      res.status(400).json({ message: error.message });
    }
};

// Update a Faq Controller
export const updateFaq = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const faq = await FAQ.findById(id);
      
      if (!faq) {
        return res.status(404).json({
          message: 'FAQ not found.',
          id: id
        });
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
      res.status(500).json({
        message: 'Error updating FAQ.',
        id: id,
        error: error.message,
      });
    }
};
  

export const deleteFaq = async (req, res) => {
    const { id } = req.params; // Extract the id from the URL
  
    try {
      const faq = await FAQ.findByIdAndDelete(id); // Find and delete the FAQ by id
      if (!faq) {
        return res.status(404).json({
          message: 'FAQ not found',
          id: id
        });
      }
  
      res.status(200).json({
        message: 'FAQ was successfully deleted',
        id: id
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting FAQ',
        id: id,
        error: error.message
      });
    }
};
  
