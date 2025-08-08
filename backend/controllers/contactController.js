import contactModel from "../models/contactModel.js";
import fs from 'fs';
import path from 'path';

// Submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service, budget, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Process uploaded files
    let fileDetails = [];
    if (req.files && req.files.length > 0) {
      fileDetails = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path
      }));
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Create contact data object
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      service,
      message: message.trim(),
      files: fileDetails,
      ipAddress,
      userAgent
    };

    // Only add budget if it's provided and not empty
    if (budget && budget.trim() !== '') {
      // Normalize budget value - handle encoding issues with rupee symbol
      let normalizedBudget = budget.trim();
      // Replace question marks or other characters with rupee symbol
      normalizedBudget = normalizedBudget.replace(/\?/g, '₹');
      normalizedBudget = normalizedBudget.replace(/Rs\.?/g, '₹');
      normalizedBudget = normalizedBudget.replace(/INR/g, '₹');
      
      contactData.budget = normalizedBudget;
    }

    // Create new contact request
    const newContact = new contactModel(contactData);

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      contactId: newContact._id
    });

  } catch (error) {
    console.error("Error submitting contact form:", error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => {
        if (err.kind === 'enum') {
          return `Invalid value for ${err.path}: ${err.value}. Allowed values are: ${err.properties.enumValues.join(', ')}`;
        }
        return err.message;
      });
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to submit contact request"
    });
  }
};

// Get all contact requests (for admin)
const getAllContacts = async (req, res) => {
  try {
    const { status, service, priority, page = 1, limit = 10, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;
    if (priority) filter.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await contactModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-files.path -ipAddress -userAgent'); // Exclude sensitive data

    const total = await contactModel.countDocuments(filter);

    res.json({
      success: true,
      contacts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: contacts.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact requests"
    });
  }
};

// Get single contact request
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await contactModel.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found"
      });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact request"
    });
  }
};

// Update contact status/notes
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes, assignedTo, estimatedValue, followUpDate } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue;
    if (followUpDate) updateData.followUpDate = followUpDate;

    // Add note if provided
    if (notes) {
      const contact = await contactModel.findById(id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact request not found"
        });
      }

      contact.notes.push({
        note: notes,
        addedBy: req.user?.name || 'Admin', // Assuming user info from auth middleware
        addedAt: new Date()
      });

      await contact.save();
    }

    const updatedContact = await contactModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found"
      });
    }

    res.json({
      success: true,
      message: "Contact request updated successfully",
      contact: updatedContact
    });

  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact request"
    });
  }
};

// Delete contact request
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contactModel.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found"
      });
    }

    // Delete associated files
    if (contact.files && contact.files.length > 0) {
      contact.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      });
    }

    await contactModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Contact request deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact request"
    });
  }
};

// Get contact statistics
const getContactStats = async (req, res) => {
  try {
    const stats = await contactModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const serviceStats = await contactModel.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await contactModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$submittedAt" },
            month: { $month: "$submittedAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      },
      {
        $limit: 12
      }
    ]);

    const totalValue = await contactModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$estimatedValue" }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        statusStats: stats,
        serviceStats: serviceStats,
        monthlyStats: monthlyStats,
        totalEstimatedValue: totalValue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const { contactId, fileIndex } = req.params;
    
    const contact = await contactModel.findById(contactId);
    
    if (!contact || !contact.files || !contact.files[fileIndex]) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    const file = contact.files[fileIndex];
    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server"
      });
    }

    res.download(filePath, file.originalName);

  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download file"
    });
  }
};

export {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
  downloadFile
};
