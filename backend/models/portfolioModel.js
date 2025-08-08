import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web', 'Design', 'Video', 'Social']
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    required: true,
    enum: ['website', 'design', 'video', 'social', 'app']
  },
  client: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Portfolio', portfolioSchema);
