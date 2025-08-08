import Portfolio from '../models/portfolioModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all portfolio items
export const getAllPortfolioItems = async (req, res) => {
  try {
    const category = req.query.category;
    const featured = req.query.featured;
    
    let query = {};
    
    // Add category filter if specified and not 'All'
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add featured filter if specified
    if (featured === 'true') {
      query.featured = true;
    }
    
    console.log('Portfolio query:', query);
    
    const portfolioItems = await Portfolio.find(query).sort({ createdAt: -1 });
    
    console.log(`Found ${portfolioItems.length} portfolio items`);
    
    res.status(200).json({
      success: true,
      count: portfolioItems.length,
      data: portfolioItems
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get portfolio item by ID
export const getPortfolioItemById = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new portfolio item
export const createPortfolioItem = async (req, res) => {
  try {
    // Handle media upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a media file'
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    
    // Detect media type based on file MIME type and extension
    const videoMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const fileMimeType = req.file.mimetype;
    
    const mediaType = videoMimeTypes.includes(fileMimeType) || videoExtensions.includes(fileExtension) ? 'video' : 'image';
    
    // Parse social links if provided
    let socialLinks = {};
    if (req.body.socialLinks) {
      try {
        socialLinks = JSON.parse(req.body.socialLinks);
      } catch (e) {
        socialLinks = {};
      }
    }
    
    // Create portfolio with image path
    const portfolioData = {
      ...req.body,
      image: imagePath,
      mediaType,
      socialLinks,
      tags: JSON.parse(req.body.tags) // Convert tags from string to array
    };
    
    const portfolioItem = await Portfolio.create(portfolioData);
    
    res.status(201).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    // Remove uploaded file if there's an error
    if (req.file) {
      const filePath = path.join(__dirname, '../', req.file.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    let portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }
    
    let updateData = { ...req.body };
    
    // Handle image update
    if (req.file) {
      // Delete old image if it exists and is not the default
      if (portfolioItem.image && portfolioItem.image !== '/uploads/default.jpg') {
        const oldImagePath = path.join(__dirname, '../', portfolioItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const imagePath = `/uploads/${req.file.filename}`;
      
      // Detect media type
      const videoMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'];
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const fileMimeType = req.file.mimetype;
      
      const mediaType = videoMimeTypes.includes(fileMimeType) || videoExtensions.includes(fileExtension) ? 'video' : 'image';
      
      updateData.image = imagePath;
      updateData.mediaType = mediaType;
    }
    
    // Handle tags if they're passed as a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = JSON.parse(req.body.tags);
    }
    
    // Handle socialLinks if they're passed as a string
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      updateData.socialLinks = JSON.parse(req.body.socialLinks);
    }
    
    // Update the portfolio item
    portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }
    
    // Delete image file
    if (portfolioItem.image && portfolioItem.image !== '/uploads/default.jpg') {
      const imagePath = path.join(__dirname, '../', portfolioItem.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete from database
    await Portfolio.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
