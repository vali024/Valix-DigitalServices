import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile App Development', 
      'Graphic Design',
      'Video Editing',
      'Social Media Management',
      'Complete Package',
      'Other'
    ]
  },
  budget: {
    type: String,
    enum: [
      'Under ₹500',
      '₹200 - ₹500',
      '₹300 - ₹800', 
      '₹300 - ₹1,200',
      '₹300 - ₹2,000',
      '₹500 - ₹1,000',
      '₹500 - ₹2,000',
      '₹800 - ₹2,000',
      '₹1,000 - ₹5,000',
      '₹2,000 - ₹4,000/month',
      '₹2,000 - ₹8,000',
      '₹2,500 - ₹3,000',
      '₹3,000 - ₹8,000',
      '₹5,000 - ₹10,000',
      '₹7,000 - ₹15,000/month',
      '₹8,000 - ₹9,500',
      '₹8,000 - ₹25,000',
      '₹8,500 - ₹9,000',
      '₹10,000 - ₹25,000',
      '₹10,000 - ₹35,000',
      '₹25,000 - ₹50,000',
      '₹25,000 - ₹1,00,000',
      '₹50,000 - ₹1,25,000',
      '₹1,00,000 - ₹3,00,000',
      '₹1,25,000 - ₹2,50,000',
      '₹2,50,000+',
      'Under ₹5,000',
      '₹5,000 - ₹15,000',
      '₹15,000 - ₹50,000',
      '₹50,000 - ₹1,00,000',
      '₹1,00,000+',
      "Let's Discuss",
      'Let\'s Discuss'
    ],
    required: false
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  files: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String
  }],
  status: {
    type: String,
    enum: ['new', 'in-progress', 'contacted', 'converted', 'closed'],
    default: 'new'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  approvedBy: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  declineReason: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  notes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: String,
    default: null
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  followUpDate: {
    type: Date
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
contactSchema.index({ status: 1, submittedAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ service: 1 });

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactModel;
