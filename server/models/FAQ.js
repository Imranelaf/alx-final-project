import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
    trim: true
  },
  category: {
    type: String,    // Category of FAQ, e.g., 'Registration', 'Payments', 'Account'
    default: 'General',
    trim: true
  },
  isPublished: {
    type: Boolean,   // Whether the FAQ is published or not
    default: true
  },
  priority: {
    type: Number,    // Priority or order in which FAQs should appear
    default: 0
  },
  tags: {
    type: [String],  // Tags to allow better filtering or searching of FAQs
    default: []
  }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
