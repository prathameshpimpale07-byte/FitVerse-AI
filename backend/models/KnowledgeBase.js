const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Workout', 'Diet', 'Injury', 'Supplement', 'Recovery', 'General'],
      default: 'General',
    },
    tags: [{ type: String, trim: true }],
    summary: { type: String, default: '' },
    content: { type: String, required: true },
    source: { type: String, default: 'FitVerse Scientific Advisory' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for text-based semantic keyword matching
knowledgeBaseSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
