import mongoose from 'mongoose';
import Portfolio from './models/portfolioModel.js';
import { connectDB } from './config/db.js';
import 'dotenv/config.js';

// Sample portfolio data
const portfolioData = [
  {
    title: 'Modern E-commerce Platform',
    category: 'Web',
    description: 'Full-featured online store with payment integration and admin dashboard',
    image: '/uploads/1720036213531food_1.png', // Use existing image
    tags: ['React', 'E-commerce', 'Responsive'],
    type: 'website',
    client: 'TechMart India',
    result: '300% increase in sales'
  },
  {
    title: 'Restaurant Brand Identity',
    category: 'Design',
    description: 'Complete branding package including logo, business cards, and menu design',
    image: '/uploads/1720036242193food_2.png', // Use existing image
    tags: ['Branding', 'Logo', 'Print Design'],
    type: 'design',
    client: 'Spice Garden',
    result: 'Brand recognition up 250%'
  },
  {
    title: 'Product Launch Campaign',
    category: 'Video',
    description: 'Dynamic promotional video with motion graphics and professional editing',
    image: '/uploads/1720036276216food_3.png', // Use existing image
    tags: ['Motion Graphics', 'Promotional', 'Editing'],
    type: 'video',
    client: 'Innovation Labs',
    result: '2M+ views achieved'
  },
  {
    title: 'Tech Startup Website',
    category: 'Web',
    description: 'Modern SaaS website with interactive elements and performance optimization',
    image: '/uploads/1720036308289food_4.png', // Use existing image
    tags: ['SaaS', 'Modern Design', 'Performance'],
    type: 'website',
    client: 'CloudSync Solutions',
    result: '400% lead generation'
  },
  {
    title: 'Social Media Growth',
    category: 'Social',
    description: 'Instagram account transformation with 300% engagement increase',
    image: '/uploads/1720036370834food_5.png', // Use existing image
    tags: ['Instagram', 'Growth', 'Content Strategy'],
    type: 'social',
    client: 'Fashion Forward',
    result: '50K followers in 3 months'
  }
];

const seedPortfolio = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check if there's already portfolio data
    const count = await Portfolio.countDocuments();
    
    if (count > 0) {
      console.log('Portfolio collection already has data. Skipping seed.');
      process.exit(0);
    }

    // Clear existing data if any
    await Portfolio.deleteMany({});
    console.log('Portfolio collection cleared');

    // Insert sample data
    await Portfolio.insertMany(portfolioData);
    console.log('Portfolio data seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding portfolio data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedPortfolio();
